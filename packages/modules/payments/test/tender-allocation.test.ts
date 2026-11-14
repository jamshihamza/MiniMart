import { DomainError, parseDec } from "@minimart/shared-kernel";
import { describe, expect, it } from "vitest";

import { allocateTenders } from "../src/index.js";

const money = (value: string) => parseDec(value);

function codeOf(work: () => unknown): string | undefined {
  try {
    work();
  } catch (error) {
    return error instanceof DomainError ? error.code : String(error);
  }
  return undefined;
}

describe("tender allocation", () => {
  it("applies non-cash first, lets cash cover the rest and returns the change", () => {
    const allocation = allocateTenders(money("22.90"), [
      { methodCode: "CASH", amount: money("20.00") },
      { methodCode: "CARD", amount: money("10.00"), reference: "TXN-1" },
    ]);
    expect(allocation.tenders).toEqual([
      { methodCode: "CARD", applied: money("10.00"), reference: "TXN-1" },
      { methodCode: "CASH", applied: money("12.90"), reference: undefined },
    ]);
    expect(allocation.tendered).toBe(money("30.00"));
    expect(allocation.cashTendered).toBe(money("20.00"));
    expect(allocation.applied).toBe(money("22.90"));
    expect(allocation.change).toBe(money("7.10"));
  });

  it("leaves the sale unsettled when too little is offered", () => {
    const allocation = allocateTenders(money("10.00"), [
      { methodCode: "CASH", amount: money("4.00") },
    ]);
    expect(allocation.applied).toBe(money("4.00"));
    expect(allocation.change).toBe(0n);
    expect(allocateTenders(money("10.00"), []).applied).toBe(0n);
  });

  it("rejects non-cash over the amount due, unknown methods and non-positive amounts", () => {
    expect(
      codeOf(() => allocateTenders(money("5"), [{ methodCode: "CARD", amount: money("5.01") }])),
    ).toBe("NON_CASH_TENDER_EXCEEDS_DUE");
    expect(
      codeOf(() => allocateTenders(money("5"), [{ methodCode: "CHEQUE", amount: money("5") }])),
    ).toBe("TENDER_METHOD_UNSUPPORTED");
    expect(codeOf(() => allocateTenders(money("5"), [{ methodCode: "CASH", amount: 0n }]))).toBe(
      "TENDER_AMOUNT_INVALID",
    );
  });
});
