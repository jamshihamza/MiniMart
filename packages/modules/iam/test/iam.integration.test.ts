import { createStoreTestDatabase, type StoreTestDatabase } from "@minimart/test-support";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createUser, findUser, listUsers } from "../src/index.js";

let database: StoreTestDatabase;
beforeAll(async () => {
  database = await createStoreTestDatabase();
}, 120_000);
afterAll(async () => {
  await database.drop();
});

describe("iam", () => {
  it("creates, finds and lists users, rejecting duplicates and blanks", async () => {
    const { tenantId, now } = database.context;
    const user = await createUser(database.sql, tenantId, " cashier.one ", now);
    expect(user.username).toBe("cashier.one");
    expect(await findUser(database.sql, tenantId, "CASHIER.ONE")).toEqual(user);
    expect((await listUsers(database.sql, tenantId)).map((entry) => entry.username)).toEqual([
      "cashier.one",
      "tester",
    ]);
    await expect(createUser(database.sql, tenantId, "Cashier.One", now)).rejects.toMatchObject({
      code: "USERNAME_TAKEN",
    });
    await expect(createUser(database.sql, tenantId, "  ", now)).rejects.toMatchObject({
      code: "USERNAME_REQUIRED",
    });
  });
});
