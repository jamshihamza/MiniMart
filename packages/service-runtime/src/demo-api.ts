import { randomUUID } from "node:crypto";
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import { extname, join, normalize, resolve, sep } from "node:path";

import {
  closeCashierShift,
  closeStoreBusinessDay,
  createProduct,
  DEMO_CASHIER,
  openCashierShift,
  postSale,
  postShiftCashMovement,
  postStockAdjustment,
  quoteSale,
} from "@minimart/application-coordinators";
import { findUser } from "@minimart/module-iam";
import { findActiveStore } from "@minimart/module-organization";
import {
  catalogWithStock,
  dashboard,
  saleReceipt,
  salesList,
  shiftDetail,
  shiftList,
  stockLedger,
  storeOverview,
} from "@minimart/query";
import {
  DomainError,
  InvalidDecimalError,
  isUuid,
  type ErrorCategory,
  type Sql,
  type StoreContext,
  type TransactionRunner,
} from "@minimart/shared-kernel";

/**
 * Demonstration Store API.
 *
 * This is NOT the frozen Store API contract. It is an unauthenticated, loopback-only HTTP surface
 * under /api/demo/v0 that exists so the POS and Back Office can be demonstrated end to end. It is
 * refused in production and never binds to a non-loopback address.
 */
export const DEMO_API_PREFIX = "/api/demo/v0";

export interface DemoApiOptions {
  readonly sql: Sql;
  readonly transactions: TransactionRunner;
  readonly port: number;
  /** URL prefix to directory of built static files, for example { "/pos": "…/dist" }. */
  readonly staticRoots?: Readonly<Record<string, string>>;
  readonly now?: () => Date;
}

type Json = Readonly<Record<string, unknown>>;

const STATUS: Record<ErrorCategory, number> = {
  VALIDATION: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  BUSINESS_RULE: 422,
};

const CONTENT_TYPES: Readonly<Record<string, string>> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

function text(body: Json, key: string): string {
  const value = body[key];
  if (typeof value !== "string") {
    throw new HttpError(400, "FIELD_REQUIRED", `${key} must be a string`);
  }
  return value;
}

function optionalText(body: Json, key: string): string | undefined {
  const value = body[key];
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") {
    throw new HttpError(400, "FIELD_INVALID", `${key} must be a string`);
  }
  return value;
}

function uuid(value: string | undefined, name: string): string {
  if (!isUuid(value)) throw new HttpError(400, "ID_INVALID", `${name} is not a valid id`);
  return value;
}

function objects(body: Json, key: string): Json[] {
  const value = body[key];
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "object" || entry === null)) {
    throw new HttpError(400, "FIELD_INVALID", `${key} must be a list`);
  }
  return value as Json[];
}

async function readBody(request: IncomingMessage): Promise<Json> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request as AsyncIterable<Buffer>) {
    size += chunk.length;
    if (size > 262_144) throw new HttpError(413, "BODY_TOO_LARGE", "Request body is too large");
    chunks.push(chunk);
  }
  if (size === 0) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "BODY_INVALID", "Request body is not valid JSON");
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new HttpError(400, "BODY_INVALID", "Request body must be a JSON object");
  }
  return parsed as Json;
}

function lines(body: Json) {
  return objects(body, "lines").map((line) => ({
    itemId: text(line, "itemId"),
    quantity: text(line, "quantity"),
  }));
}

function tenders(body: Json) {
  if (body["tenders"] === undefined) return [];
  return objects(body, "tenders").map((tender) => {
    const reference = optionalText(tender, "reference");
    return {
      methodCode: text(tender, "methodCode"),
      amount: text(tender, "amount"),
      ...(reference === undefined ? {} : { reference }),
    };
  });
}

export class StoreDemoApiServer {
  readonly #options: DemoApiOptions;
  readonly #server: Server;
  #listening = false;

  constructor(options: DemoApiOptions) {
    this.#options = options;
    this.#server = createServer((request, response) => {
      void this.#handle(request, response).catch((error: unknown) => {
        this.#fail(response, error);
      });
    });
    this.#server.requestTimeout = 15_000;
    this.#server.headersTimeout = 10_000;
  }

  get address(): AddressInfo | null {
    const address = this.#server.address();
    return typeof address === "object" ? address : null;
  }

  async start(): Promise<void> {
    if (this.#listening) return;
    await new Promise<void>((done, reject) => {
      this.#server.once("error", reject);
      // Loopback only: this surface has no authentication.
      this.#server.listen(this.#options.port, "127.0.0.1", () => {
        this.#server.off("error", reject);
        this.#listening = true;
        done();
      });
    });
  }

  async close(): Promise<void> {
    if (!this.#listening) return;
    this.#listening = false;
    await new Promise<void>((done, reject) => {
      this.#server.close((error) => (error === undefined ? done() : reject(error)));
      this.#server.closeAllConnections();
    });
  }

  #fail(response: ServerResponse, error: unknown): void {
    let status = 500;
    let code = "INTERNAL_ERROR";
    let message = "The Store Node could not complete the request";
    let details: unknown;
    if (error instanceof DomainError) {
      status = STATUS[error.category];
      code = error.code;
      message = error.message;
      details = error.details;
    } else if (error instanceof HttpError) {
      status = error.status;
      code = error.code;
      message = error.message;
    } else if (error instanceof InvalidDecimalError) {
      status = 400;
      code = "DECIMAL_INVALID";
      message = error.message;
    }
    if (response.headersSent) {
      response.end();
      return;
    }
    response.writeHead(status, { "Content-Type": "application/problem+json; charset=utf-8" });
    response.end(
      JSON.stringify({
        type: "about:blank",
        title: message,
        status,
        code,
        ...(details === undefined ? {} : { details }),
        correlationId: randomUUID(),
      }),
    );
  }

  async #context(request: IncomingMessage): Promise<StoreContext> {
    const { sql } = this.#options;
    const store = await findActiveStore(sql);
    if (store === null)
      throw new HttpError(503, "STORE_NOT_PROVISIONED", "No store is provisioned");
    const header = request.headers["x-minimart-user"];
    const username = typeof header === "string" && header !== "" ? header : DEMO_CASHIER;
    const user = await findUser(sql, store.tenantId, username);
    if (user === null) throw new HttpError(401, "USER_UNKNOWN", `Unknown user ${username}`);
    return {
      tenantId: store.tenantId,
      companyId: store.companyId,
      storeId: store.storeId,
      currencyCode: store.currencyCode,
      timezoneName: store.timezoneName,
      actorId: user.userId,
      now: (this.#options.now ?? (() => new Date()))(),
    };
  }

  #idempotencyKey(request: IncomingMessage): string {
    const key = request.headers["idempotency-key"];
    if (typeof key !== "string" || key === "") {
      throw new HttpError(400, "IDEMPOTENCY_KEY_REQUIRED", "Idempotency-Key header is required");
    }
    return key;
  }

  #static(path: string, response: ServerResponse): boolean {
    for (const [prefix, root] of Object.entries(this.#options.staticRoots ?? {})) {
      if (path !== prefix && !path.startsWith(`${prefix}/`)) continue;
      if (path === prefix) {
        response.writeHead(302, { Location: `${prefix}/` });
        response.end();
        return true;
      }
      const base = resolve(root);
      const relative = normalize(decodeURIComponent(path.slice(prefix.length + 1)));
      let file = join(base, relative);
      if (file !== base && !file.startsWith(base + sep)) return false;
      if (!existsSync(file) || statSync(file).isDirectory()) {
        // Single-page application fallback, but never for a missing asset file.
        if (extname(relative) !== "") return false;
        file = join(base, "index.html");
        if (!existsSync(file)) return false;
      }
      response.writeHead(200, {
        "Content-Type": CONTENT_TYPES[extname(file)] ?? "application/octet-stream",
        "Cache-Control": "no-store",
      });
      createReadStream(file).pipe(response);
      return true;
    }
    return false;
  }

  async #handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const method = request.method ?? "GET";
    if (!url.pathname.startsWith(`${DEMO_API_PREFIX}/`)) {
      if (method === "GET" && this.#static(url.pathname, response)) return;
      if (method === "GET" && url.pathname === "/") {
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.end(
          '<!doctype html><meta charset="utf-8"><title>MiniMart demo</title>' +
            '<body style="font-family:system-ui;margin:48px"><h1>MiniMart demo</h1>' +
            '<p><a href="/pos/">POS terminal</a></p><p><a href="/backoffice/">Back Office</a></p>',
        );
        return;
      }
      throw new HttpError(404, "NOT_FOUND", "Not found");
    }

    const { sql, transactions } = this.#options;
    const route = url.pathname.slice(DEMO_API_PREFIX.length);
    const segments = route.split("/").filter((segment) => segment !== "");
    const json = (body: unknown, status = 200): void => {
      response.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      });
      response.end(JSON.stringify(body));
    };
    const key = `${method} /${segments[0] ?? ""}${segments.length > 1 ? "/…" : ""}`;

    if (method === "GET" && route === "/health") {
      json({ status: "UP", time: new Date().toISOString() });
      return;
    }
    const context = await this.#context(request);

    if (method === "GET") {
      const query = url.searchParams.get("q") ?? undefined;
      const limitText = url.searchParams.get("limit");
      const limit = limitText === null ? undefined : Number(limitText);
      if (limit !== undefined && !Number.isSafeInteger(limit)) {
        throw new HttpError(400, "LIMIT_INVALID", "limit must be an integer");
      }
      const paging = {
        ...(query === undefined ? {} : { query }),
        ...(limit === undefined ? {} : { limit }),
      };
      switch (route) {
        case "/context":
          json(await storeOverview(sql, context, url.searchParams.get("counterId") ?? undefined));
          return;
        case "/dashboard":
          json(await dashboard(sql, context));
          return;
        case "/items":
          json({ items: await catalogWithStock(sql, context, paging) });
          return;
        case "/inventory/movements": {
          const itemId = url.searchParams.get("itemId");
          json({
            movements: await stockLedger(sql, context, {
              ...(itemId === null ? {} : { itemId: uuid(itemId, "itemId") }),
              ...(limit === undefined ? {} : { limit }),
            }),
          });
          return;
        }
        case "/sales": {
          const businessDate = url.searchParams.get("businessDate");
          json({
            sales: await salesList(sql, context, {
              ...(limit === undefined ? {} : { limit }),
              ...(businessDate === null ? {} : { businessDate }),
            }),
          });
          return;
        }
        case "/shifts":
          json({ shifts: await shiftList(sql, context) });
          return;
        default:
      }
      if (segments.length === 2 && (segments[0] === "sales" || segments[0] === "shifts")) {
        const id = uuid(segments[1], "id");
        const found =
          segments[0] === "sales"
            ? await saleReceipt(sql, context, id)
            : await shiftDetail(sql, context, id);
        if (found === null) throw new HttpError(404, "NOT_FOUND", "Not found");
        json(found);
        return;
      }
      throw new HttpError(404, "NOT_FOUND", `No demo route for ${key}`);
    }

    if (method !== "POST") throw new HttpError(405, "METHOD_NOT_ALLOWED", "Method not allowed");
    const body = await readBody(request);

    if (route === "/sales/quote") {
      json(await quoteSale(sql, context, { lines: lines(body), tenders: tenders(body) }));
      return;
    }
    if (route === "/sales") {
      const posted = await postSale(transactions, context, {
        idempotencyKey: this.#idempotencyKey(request),
        counterId: uuid(text(body, "counterId"), "counterId"),
        lines: lines(body),
        tenders: tenders(body),
      });
      json(
        {
          ...posted,
          receipt: await saleReceipt(sql, context, posted.saleId),
          changeDue: posted.quote?.payment.changeDue ?? null,
        },
        posted.replayed ? 200 : 201,
      );
      return;
    }
    if (route === "/items") {
      const item = await createProduct(transactions, context, {
        itemCode: text(body, "itemCode"),
        name: text(body, "name"),
        sellingPrice: text(body, "sellingPrice"),
        ...Object.fromEntries(
          (["barcode", "categoryName", "uomCode", "openingQuantity", "openingUnitCost"] as const)
            .map((field) => [field, optionalText(body, field)] as const)
            .filter(([, value]) => value !== undefined),
        ),
      });
      json(item, 201);
      return;
    }
    if (route === "/inventory/adjustments") {
      const unitCost = optionalText(body, "unitCost");
      json(
        await postStockAdjustment(transactions, context, {
          idempotencyKey: this.#idempotencyKey(request),
          itemId: uuid(text(body, "itemId"), "itemId"),
          quantityDelta: text(body, "quantityDelta"),
          reason: text(body, "reason"),
          ...(unitCost === undefined ? {} : { unitCost }),
        }),
        201,
      );
      return;
    }
    if (route === "/shifts") {
      const shift = await openCashierShift(transactions, context, {
        idempotencyKey: this.#idempotencyKey(request),
        counterId: uuid(text(body, "counterId"), "counterId"),
        openingCash: text(body, "openingCash"),
      });
      json(await shiftDetail(sql, context, shift.shiftId), 201);
      return;
    }
    if (segments.length === 3 && segments[0] === "shifts") {
      const shiftId = uuid(segments[1], "shiftId");
      if (segments[2] === "close") {
        await closeCashierShift(transactions, context, {
          idempotencyKey: this.#idempotencyKey(request),
          shiftId,
          countedCash: text(body, "countedCash"),
        });
      } else if (segments[2] === "cash-in" || segments[2] === "cash-out") {
        await postShiftCashMovement(transactions, context, {
          idempotencyKey: this.#idempotencyKey(request),
          shiftId,
          direction: segments[2] === "cash-in" ? "IN" : "OUT",
          amount: text(body, "amount"),
          reason: text(body, "reason"),
        });
      } else {
        throw new HttpError(404, "NOT_FOUND", `No demo route for ${key}`);
      }
      json(await shiftDetail(sql, context, shiftId));
      return;
    }
    if (segments.length === 3 && segments[0] === "business-days" && segments[2] === "close") {
      json(await closeStoreBusinessDay(transactions, context, uuid(segments[1], "businessDayId")));
      return;
    }
    throw new HttpError(404, "NOT_FOUND", `No demo route for ${key}`);
  }
}

/** Reads the demo API port. Returns undefined unless the demo is explicitly enabled. */
export function loadDemoApiPort(environment: NodeJS.ProcessEnv = process.env): number | undefined {
  if (environment["MINIMART_DEMO_API"] !== "1") return undefined;
  if (environment["NODE_ENV"] === "production") {
    throw new Error("The demonstration API cannot be enabled in production");
  }
  const port = Number(environment["MINIMART_DEMO_PORT"] ?? "4780");
  if (!Number.isSafeInteger(port) || port < 1 || port > 65535) {
    throw new Error("MINIMART_DEMO_PORT must be a valid port");
  }
  return port;
}
