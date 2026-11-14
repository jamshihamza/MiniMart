// Client for the Store Node demonstration API. All money and quantities are exact decimal strings
// produced by the Store Node; this client never computes money.
const PREFIX = "/api/demo/v0";

export interface CatalogItem {
  readonly itemId: string;
  readonly itemCode: string | null;
  readonly name: string;
  readonly categoryName: string | null;
  readonly uomCode: string;
  readonly barcode: string | null;
  readonly stockManaged: boolean;
  readonly sellingPrice: string | null;
  readonly onHand: string | null;
  readonly movingWac: string | null;
  readonly stockValue: string | null;
}

export interface Movement {
  readonly stockMovementId: string;
  readonly itemCode: string | null;
  readonly itemName: string;
  readonly quantityDelta: string;
  readonly unitCost: string;
  readonly movementType: string;
  readonly businessDate: string;
  readonly occurredAt: string;
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

export interface Receipt {
  readonly documentNo: string;
  readonly businessDate: string;
  readonly postedAt: string;
  readonly lines: readonly {
    readonly lineNo: number;
    readonly itemCode: string | null;
    readonly itemName: string;
    readonly quantity: string;
    readonly unitPrice: string;
    readonly lineTotal: string;
  }[];
  readonly grandTotal: string;
  readonly tenders: readonly {
    readonly methodCode: string;
    readonly amount: string;
    readonly reference: string | null;
  }[];
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

export interface BusinessDay {
  readonly businessDayId: string;
  readonly businessDate: string;
  readonly status: string;
  readonly openedAt: string | null;
  readonly closedAt: string | null;
}

export interface Dashboard {
  readonly businessDate: string;
  readonly businessDayOpen: boolean;
  readonly saleCount: number;
  readonly salesTotal: string;
  readonly itemCount: number;
  readonly zeroStockCount: number;
  readonly stockValue: string;
  readonly openShifts: readonly Shift[];
  readonly recentSales: readonly SaleSummary[];
  readonly businessDays: readonly BusinessDay[];
}

export interface StoreOverview {
  readonly store: {
    readonly displayName: string;
    readonly companyDisplayName: string;
    readonly currencyCode: string;
  } | null;
  readonly operator: string | null;
  readonly calendarDate: string;
}

export interface NewProduct {
  readonly itemCode: string;
  readonly name: string;
  readonly sellingPrice: string;
  readonly barcode?: string;
  readonly categoryName?: string;
  readonly openingQuantity?: string;
  readonly openingUnitCost?: string;
}

export class ApiProblem extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiProblem";
  }
}

async function call<Result>(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
  idempotencyKey?: string,
): Promise<Result> {
  let response: Response;
  let payload: unknown;
  try {
    response = await fetch(`${PREFIX}${path}`, {
      method,
      headers: {
        "X-MiniMart-User": "store.manager",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...(idempotencyKey === undefined ? {} : { "Idempotency-Key": idempotencyKey }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    payload = await response.json();
  } catch {
    throw new ApiProblem("UNREACHABLE", "Store Node is not answering.");
  }
  if (!response.ok) {
    const problem = payload as { code?: string; title?: string };
    throw new ApiProblem(problem.code ?? "UNKNOWN", problem.title ?? "Request failed");
  }
  return payload as Result;
}

export const backOfficeApi = {
  context: () => call<StoreOverview>("GET", "/context"),
  dashboard: () => call<Dashboard>("GET", "/dashboard"),
  items: () => call<{ items: CatalogItem[] }>("GET", "/items?limit=200"),
  createItem: (idempotencyKey: string, product: NewProduct) =>
    call<CatalogItem>("POST", "/items", product, idempotencyKey),
  movements: () => call<{ movements: Movement[] }>("GET", "/inventory/movements?limit=200"),
  adjust: (
    idempotencyKey: string,
    adjustment: { itemId: string; quantityDelta: string; reason: string; unitCost?: string },
  ) => call<{ onHandAfter: string }>("POST", "/inventory/adjustments", adjustment, idempotencyKey),
  sales: () => call<{ sales: SaleSummary[] }>("GET", "/sales?limit=200"),
  receipt: (saleId: string) => call<Receipt>("GET", `/sales/${saleId}`),
  shifts: () => call<{ shifts: Shift[] }>("GET", "/shifts"),
  shift: (shiftId: string) => call<ShiftDetail>("GET", `/shifts/${shiftId}`),
  closeBusinessDay: (idempotencyKey: string, businessDayId: string) =>
    call<BusinessDay>("POST", `/business-days/${businessDayId}/close`, {}, idempotencyKey),
};

export type BackOfficeApi = typeof backOfficeApi;
