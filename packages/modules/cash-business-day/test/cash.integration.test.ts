import { createStoreTestDatabase, type StoreTestDatabase } from "@minimart/test-support";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { parseDec, uuidv7 } from "@minimart/shared-kernel";

import {
  addTenderToShift,
  closeBusinessDay,
  closeShift,
  ensureOpenBusinessDay,
  findOpenBusinessDay,
  findOpenShift,
  listBusinessDays,
  listCashMovements,
  listShifts,
  listTenderSummaries,
  openShift,
  postCashMovement,
} from "../src/index.js";

let database: StoreTestDatabase;
beforeAll(async () => {
  database = await createStoreTestDatabase();
}, 120_000);
afterAll(async () => {
  await database.drop();
});

describe("cash and business day", () => {
  let shiftId: string;
  let businessDayId: string;

  it("opens the business day once and one shift per counter", async () => {
    expect(await findOpenBusinessDay(database.sql, database.context)).toBeNull();
    const day = await database.transactions.run((sql) =>
      ensureOpenBusinessDay(sql, database.context, "2026-09-26"),
    );
    businessDayId = day.businessDayId;
    const again = await database.transactions.run((sql) =>
      ensureOpenBusinessDay(sql, database.context, "2026-09-27"),
    );
    expect(again.businessDayId).toBe(businessDayId);
    const open = () =>
      database.transactions.run((sql) =>
        openShift(sql, database.context, {
          counterId: database.counterId,
          userId: database.context.actorId,
          businessDayId,
          openingFloat: parseDec("200"),
          postingEnvelopeId: uuidv7(),
        }),
      );
    const shift = await open();
    shiftId = shift.shiftId;
    expect(shift).toMatchObject({
      status: "OPEN",
      expectedCash: "200.00000000",
      businessDate: "2026-09-26",
    });
    await expect(open()).rejects.toMatchObject({ code: "SHIFT_ALREADY_OPEN" });
    expect((await findOpenShift(database.sql, database.context, database.counterId))?.shiftId).toBe(
      shiftId,
    );
  });

  it("derives expected cash only from immutable cash movements", async () => {
    const post = (movementType: "CASH_SALE" | "CASH_OUT", amount: string, key: string) =>
      database.transactions.run((sql) =>
        postCashMovement(sql, database.context, {
          shiftId,
          movementType,
          amount: parseDec(amount),
          sourceContext: "TEST",
          sourceType: "TEST",
          sourceId: uuidv7(),
          sourceEffectKey: key,
          postingEnvelopeId: uuidv7(),
        }),
      );
    await post("CASH_SALE", "12.90", "k1");
    await post("CASH_OUT", "-50", "k2");
    await expect(post("CASH_OUT", "-500", "k3")).rejects.toMatchObject({
      code: "CASH_OUT_EXCEEDS_EXPECTED",
    });
    await expect(post("CASH_SALE", "0", "k4")).rejects.toMatchObject({ code: "CASH_AMOUNT_ZERO" });
    await expect(post("CASH_SALE", "1", "k1")).rejects.toThrow(/duplicate key/);
    const movements = await listCashMovements(database.sql, database.context, shiftId);
    expect(movements.map((movement) => [movement.movementType, movement.amount])).toEqual([
      ["OPENING_FLOAT", "200.00000000"],
      ["CASH_SALE", "12.90000000"],
      ["CASH_OUT", "-50.00000000"],
    ]);
    await expect(database.pool.query("DELETE FROM cash.cash_movements")).rejects.toThrow(
      /immutable/,
    );
    await database.transactions.run(async (sql) => {
      await addTenderToShift(sql, database.context, shiftId, "CASH", parseDec("12.90"));
      await addTenderToShift(sql, database.context, shiftId, "CASH", parseDec("1.10"));
      await addTenderToShift(sql, database.context, shiftId, "CARD", parseDec("5"));
    });
    expect(await listTenderSummaries(database.sql, database.context, shiftId)).toEqual([
      { methodCode: "CARD", amount: "5.00000000" },
      { methodCode: "CASH", amount: "14.00000000" },
    ]);
  });

  it("closes the shift without rewriting expected cash, then the day", async () => {
    await expect(
      database.transactions.run((sql) => closeBusinessDay(sql, database.context, businessDayId)),
    ).rejects.toMatchObject({ code: "OPEN_SHIFTS_BLOCK_DAY_CLOSE" });
    const closed = await database.transactions.run((sql) =>
      closeShift(sql, database.context, { shiftId, countedCash: parseDec("165.00") }),
    );
    expect(closed).toMatchObject({
      status: "CLOSED",
      expectedCash: "162.90000000",
      actualCash: "165.00000000",
      varianceAmount: "2.10000000",
    });
    await expect(
      database.transactions.run((sql) =>
        closeShift(sql, database.context, { shiftId, countedCash: 0n }),
      ),
    ).rejects.toMatchObject({ code: "SHIFT_NOT_OPEN" });
    expect(await findOpenShift(database.sql, database.context, database.counterId)).toBeNull();
    expect(await listShifts(database.sql, database.context)).toHaveLength(1);
    const day = await database.transactions.run((sql) =>
      closeBusinessDay(sql, database.context, businessDayId),
    );
    expect(day.status).toBe("CLOSED");
    await expect(
      database.transactions.run((sql) =>
        ensureOpenBusinessDay(sql, database.context, "2026-09-26"),
      ),
    ).rejects.toMatchObject({ code: "BUSINESS_DAY_CLOSED" });
    expect((await listBusinessDays(database.sql, database.context))[0]?.status).toBe("CLOSED");
  });
});
