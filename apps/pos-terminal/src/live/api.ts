// Client for the Store Node demonstration API. All money and quantities are exact decimal strings
// produced by the Store Node; this client never computes money.
const PREFIX = "/api/demo/v0";

export interface Counter {
  readonly counterId: string;
  readonly counterCode: string;
  readonly displayName: string;
}

export interface Shift {
  readonly shiftId: string;
  readonly counterCode: string | null;
  readonly cashier: string;
  readonly businessDate: string;
  readonly status: string;
  readonly openingCash: string | null;
  readonly expectedCash: string | null;
  readonly countedCash: string | null;
  readonly variance: string | null;
  readonly openedAt: string;
  readonly closedAt: string | null;
}

export interface ShiftDetail extends Shift {
  readonly cashMovements: readonly {
    readonly cashMovementId: string;
    readonly movementType: string;
    readonly amount: string;
    readonly reasonCode: string | null;
    readonly occurredAt: string;
  }[];
  readonly tenders: readonly { readonly methodCode: string; readonly amount: string }[];
}

export interface StoreOverview {
  readonly store: {
    readonly storeCode: string;
    readonly displayName: string;
    readonly currencyCode: string;
  } | null;
  readonly counters: readonly Counter[];
  readonly operator: string | null;
  readonly counter: Counter | null;
  readonly businessDay: { readonly businessDayId: string; readonly businessDate: string } | null;
  readonly calendarDate: string;
  readonly shift: Shift | null;
}

export interface CatalogItem {
  readonly itemId: string;
  readonly itemCode: string | null;
  readonly name: string;
  readonly categoryName: string | null;
  readonly uomCode: string;
  readonly barcode: string | null;
  readonly sellingPrice: string | null;
  readonly onHand: string | null;
}

export interface Quote {
  readonly lines: readonly {
    readonly itemId: string;
    readonly itemName: string;
    readonly quantity: string;
    readonly unitPrice: string;
    readonly lineTotal: string;
  }[];
  readonly itemCount: string;
  readonly subtotal: string;
  readonly discountTotal: string;
  readonly taxTotal: string;
  readonly grandTotal: string;
  readonly payment: {
    readonly cashTendered?: string | null;
    readonly remaining: string;
    readonly changeDue: string;
    readonly settled: boolean;
  };
}

export interface Receipt {
  readonly saleId: string;
  readonly documentNo: string;
  readonly businessDate: string;
  readonly postedAt: string;
  readonly store: { readonly displayName?: string; readonly counterCode?: string } | null;
  readonly lines: readonly {
    readonly lineNo: number;
    readonly itemName: string;
    readonly quantity: string;
    readonly unitPrice: string;
    readonly lineTotal: string;
  }[];
  readonly subtotal: string;
  readonly taxTotal: string;
  readonly grandTotal: string;
  readonly tenders: readonly {
    readonly methodCode: string;
    readonly amount: string;
    readonly reference: string | null;
  }[];
}

export interface SaleSummary {
  readonly saleId: string;
  readonly documentNo: string;
  readonly counterCode: string | null;
  readonly businessDate: string;
  readonly postedAt: string;
  readonly grandTotal: string;
  readonly tenders: readonly string[];
}

export interface CartLine {
  readonly itemId: string;
  readonly quantity: string;
}

export interface Tender {
  readonly methodCode: "CASH" | "CARD" | "DUITNOW";
  readonly amount: string;
  readonly reference?: string;
}

/** The Store Node answered and refused the request. Safe to show; nothing was posted. */
export class ApiProblem extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiProblem";
  }
}

/** No answer was received. For a posting request the outcome is unknown. */
export class ApiUnreachable extends Error {
  constructor() {
    super("The Store Node did not answer");
    this.name = "ApiUnreachable";
  }
}

async function call<Result>(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
  idempotencyKey?: string,
): Promise<Result> {
  let response: Response;
  try {
    response = await fetch(`${PREFIX}${path}`, {
      method,
      headers: {
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...(idempotencyKey === undefined ? {} : { "Idempotency-Key": idempotencyKey }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch {
    throw new ApiUnreachable();
  }
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ApiUnreachable();
  }
  if (!response.ok) {
    const problem = payload as { code?: string; title?: string };
    throw new ApiProblem(
      response.status,
      problem.code ?? "UNKNOWN",
      problem.title ?? "Request failed",
    );
  }
  return payload as Result;
}

export const storeApi = {
  health: () => call<{ status: string }>("GET", "/health"),
  context: (counterId?: string) =>
    call<StoreOverview>(
      "GET",
      `/context${counterId === undefined ? "" : `?counterId=${encodeURIComponent(counterId)}`}`,
    ),
  items: (query = "") =>
    call<{ items: CatalogItem[] }>("GET", `/items?limit=200&q=${encodeURIComponent(query)}`),
  quote: (lines: readonly CartLine[], tenders: readonly Tender[]) =>
    call<Quote>("POST", "/sales/quote", { lines, tenders }),
  postSale: (
    idempotencyKey: string,
    counterId: string,
    lines: readonly CartLine[],
    tenders: readonly Tender[],
  ) =>
    call<{
      saleId: string;
      documentNo: string;
      changeDue: string | null;
      cashTendered: string | null;
      receipt: Receipt;
    }>("POST", "/sales", { counterId, lines, tenders }, idempotencyKey),
  sales: () => call<{ sales: SaleSummary[] }>("GET", "/sales?limit=50"),
  receipt: (saleId: string) => call<Receipt>("GET", `/sales/${saleId}`),
  shift: (shiftId: string) => call<ShiftDetail>("GET", `/shifts/${shiftId}`),
  openShift: (idempotencyKey: string, counterId: string, openingCash: string) =>
    call<ShiftDetail>("POST", "/shifts", { counterId, openingCash }, idempotencyKey),
  cashMovement: (
    idempotencyKey: string,
    shiftId: string,
    direction: "cash-in" | "cash-out",
    amount: string,
    reason: string,
  ) =>
    call<ShiftDetail>(
      "POST",
      `/shifts/${shiftId}/${direction}`,
      { amount, reason },
      idempotencyKey,
    ),
  closeShift: (idempotencyKey: string, shiftId: string, countedCash: string) =>
    call<ShiftDetail>("POST", `/shifts/${shiftId}/close`, { countedCash }, idempotencyKey),
};

export type StoreApi = typeof storeApi;

export function newIdempotencyKey(): string {
  return globalThis.crypto.randomUUID();
}
