import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { createStoreTestDatabase, type StoreTestDatabase } from "@minimart/test-support";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { DEMO_API_PREFIX, loadDemoApiPort, StoreDemoApiServer } from "../src/index.js";

let database: StoreTestDatabase;
let server: StoreDemoApiServer;
let origin: string;
let staticDirectory: string;

async function call(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
  idempotencyKey?: string,
): Promise<{ status: number; body: Record<string, unknown> }> {
  const response = await fetch(`${origin}${DEMO_API_PREFIX}${path}`, {
    method,
    headers: {
      "x-minimart-user": "tester",
      ...(body === undefined ? {} : { "content-type": "application/json" }),
      ...(idempotencyKey === undefined ? {} : { "idempotency-key": idempotencyKey }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return { status: response.status, body: (await response.json()) as Record<string, unknown> };
}

beforeAll(async () => {
  database = await createStoreTestDatabase("mm_api");
  staticDirectory = mkdtempSync(join(tmpdir(), "mm-static-"));
  mkdirSync(join(staticDirectory, "assets"));
  writeFileSync(join(staticDirectory, "index.html"), "<h1>app</h1>");
  writeFileSync(join(staticDirectory, "assets", "app.js"), "console.log(1)");
  server = new StoreDemoApiServer({
    sql: database.sql,
    transactions: database.transactions,
    port: 0,
    staticRoots: { "/pos": staticDirectory },
    now: () => new Date("2026-09-26T03:00:00Z"),
  });
  await server.start();
  origin = `http://127.0.0.1:${server.address?.port}`;
}, 120_000);

afterAll(async () => {
  await server.close();
  await database.drop();
  rmSync(staticDirectory, { recursive: true, force: true });
});

describe("demonstration Store API", () => {
  it("binds to loopback only and is refused in production", () => {
    expect(server.address?.address).toBe("127.0.0.1");
    expect(loadDemoApiPort({})).toBeUndefined();
    expect(loadDemoApiPort({ MINIMART_DEMO_API: "1" })).toBe(4780);
    expect(() => loadDemoApiPort({ MINIMART_DEMO_API: "1", NODE_ENV: "production" })).toThrow();
    expect(() => loadDemoApiPort({ MINIMART_DEMO_API: "1", MINIMART_DEMO_PORT: "0" })).toThrow();
  });

  it("serves built front-end files with a single-page fallback and no path traversal", async () => {
    const index = await fetch(`${origin}/pos/some/route`);
    expect(await index.text()).toBe("<h1>app</h1>");
    const asset = await fetch(`${origin}/pos/assets/app.js`);
    expect(asset.headers.get("content-type")).toContain("text/javascript");
    expect((await fetch(`${origin}/pos/assets/missing.js`)).status).toBe(404);
    expect((await fetch(`${origin}/pos/..%2F..%2Fetc%2Fpasswd`)).status).toBe(404);
    expect((await fetch(`${origin}/`)).status).toBe(200);
    expect((await fetch(`${origin}/elsewhere`)).status).toBe(404);
  });

  it("runs a full store day through HTTP", async () => {
    expect((await call("GET", "/health")).body["status"]).toBe("UP");
    const context = await call("GET", "/context");
    expect(context.body).toMatchObject({ operator: "tester", shift: null, businessDay: null });
    const counterId = (context.body["counter"] as { counterId: string }).counterId;

    const created = await call("POST", "/items", {
      itemCode: "A-1",
      name: "Cola 320ml",
      barcode: "9556001000011",
      categoryName: "Beverages",
      sellingPrice: "2.50",
      openingQuantity: "10",
      openingUnitCost: "1.60",
    });
    expect(created.status).toBe(201);
    const itemId = created.body["itemId"] as string;
    const duplicate = await call("POST", "/items", { itemCode: "A-1", name: "x", sellingPrice: "1" });
    expect(duplicate).toMatchObject({ status: 409, body: { code: "ITEM_CODE_TAKEN" } });

    const lines = [{ itemId, quantity: "3" }];
    const quote = await call("POST", "/sales/quote", {
      lines,
      tenders: [{ methodCode: "CASH", amount: "10" }],
    });
    expect(quote.body).toMatchObject({
      grandTotal: "7.50",
      payment: { changeDue: "2.50", settled: true },
    });

    const sale = { counterId, lines, tenders: [{ methodCode: "CASH", amount: "10" }] };
    expect(await call("POST", "/sales", sale)).toMatchObject({
      status: 400,
      body: { code: "IDEMPOTENCY_KEY_REQUIRED" },
    });
    expect(await call("POST", "/sales", sale, "http-sale-0001")).toMatchObject({
      status: 422,
      body: { code: "SHIFT_REQUIRED" },
    });

    const opened = await call("POST", "/shifts", { counterId, openingCash: "100" }, "http-open-0001");
    expect(opened).toMatchObject({ status: 201, body: { status: "OPEN", expectedCash: "100.00" } });
    const shiftId = opened.body["shiftId"] as string;

    const posted = await call("POST", "/sales", sale, "http-sale-0002");
    expect(posted).toMatchObject({
      status: 201,
      body: { documentNo: "POS01-000001", changeDue: "2.50", replayed: false },
    });
    expect(await call("POST", "/sales", sale, "http-sale-0002")).toMatchObject({
      status: 200,
      body: { replayed: true, saleId: posted.body["saleId"] },
    });
    const receipt = await call("GET", `/sales/${posted.body["saleId"] as string}`);
    expect(receipt.body).toMatchObject({
      grandTotal: "7.50",
      lines: [{ itemName: "Cola 320ml", quantity: "3", lineTotal: "7.50" }],
      tenders: [{ methodCode: "CASH", amount: "7.50" }],
    });

    const oversell = await call(
      "POST",
      "/sales",
      { ...sale, lines: [{ itemId, quantity: "8" }], tenders: [{ methodCode: "CASH", amount: "20" }] },
      "http-sale-0003",
    );
    expect(oversell).toMatchObject({ status: 422, body: { code: "NEGATIVE_STOCK_BLOCKED" } });

    const adjusted = await call(
      "POST",
      "/inventory/adjustments",
      { itemId, quantityDelta: "-2", reason: "Damage" },
      "http-adjust-0001",
    );
    expect(adjusted).toMatchObject({ status: 201, body: { onHandAfter: "5" } });
    const items = await call("GET", "/items?q=cola");
    expect(items.body["items"]).toEqual([
      expect.objectContaining({ onHand: "5", sellingPrice: "2.50", stockValue: "8.00" }),
    ]);
    const movements = await call("GET", `/inventory/movements?itemId=${itemId}`);
    expect(
      (movements.body["movements"] as { movementType: string }[]).map((entry) => entry.movementType),
    ).toEqual(["ADJUSTMENT", "SALE", "OPENING_STOCK"]);

    await call("POST", `/shifts/${shiftId}/cash-out`, { amount: "20", reason: "Ice" }, "http-out-0001");
    const dash = await call("GET", "/dashboard");
    expect(dash.body).toMatchObject({
      businessDate: "2026-09-26",
      saleCount: 1,
      salesTotal: "7.50",
      itemCount: 1,
      stockValue: "8.00",
    });
    const closed = await call("POST", `/shifts/${shiftId}/close`, { countedCash: "87.50" }, "http-close-1");
    expect(closed.body).toMatchObject({
      status: "CLOSED",
      expectedCash: "87.50",
      countedCash: "87.50",
      variance: "0.00",
      tenders: [{ methodCode: "CASH", amount: "7.50" }],
    });
    expect((closed.body["cashMovements"] as unknown[]).length).toBe(3);
    const sales = await call("GET", "/sales");
    expect(sales.body["sales"]).toEqual([
      expect.objectContaining({ documentNo: "POS01-000001", grandTotal: "7.50", tenders: ["CASH"] }),
    ]);
    const dayId = (dash.body["businessDays"] as { businessDayId: string }[])[0]!.businessDayId;
    expect((await call("POST", `/business-days/${dayId}/close`, {})).body["status"]).toBe("CLOSED");
  });

  it("answers bad requests with problem details", async () => {
    expect(await call("GET", "/nope")).toMatchObject({ status: 404, body: { code: "NOT_FOUND" } });
    expect(await call("GET", "/sales/not-a-uuid")).toMatchObject({ status: 400 });
    expect(await call("POST", "/sales/quote", { lines: "x" })).toMatchObject({ status: 400 });
    expect(
      await call("POST", "/sales/quote", { lines: [{ itemId: "x", quantity: "1" }] }),
    ).toMatchObject({ status: 400, body: { code: "ITEM_ID_INVALID" } });
    const unknownUser = await fetch(`${origin}${DEMO_API_PREFIX}/context`, {
      headers: { "x-minimart-user": "nobody" },
    });
    expect(unknownUser.status).toBe(401);
    const malformed = await fetch(`${origin}${DEMO_API_PREFIX}/sales/quote`, {
      method: "POST",
      headers: { "x-minimart-user": "tester" },
      body: "{",
    });
    expect(malformed.status).toBe(400);
  });
});
