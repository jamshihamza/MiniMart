/**
 * MM-010 TEST-ONLY: fixture verification against the ACTUAL frozen files. No database needed.
 * This is not a conformance run and does not use the frozen conformance suite.
 */
import { describe, expect, it } from "vitest";

import {
  businessDayFixture,
  createdAtFor,
  OTHER_TENANT_ID,
  TEST_TENANT_ID,
} from "./harness/fixtures.js";
import {
  evaluateCompatibility,
  loadFrozenContract,
  wireFormatProblems,
} from "./harness/frozen-contract.js";
import { envelopeFromFixture } from "./harness/wiring.js";

const contract = loadFrozenContract();
const fixture = businessDayFixture(1);
const goodMessage = (): Record<string, unknown> =>
  JSON.parse(JSON.stringify(envelopeFromFixture(contract, fixture))) as Record<string, unknown>;

describe("frozen registry", () => {
  it("lists the 20 registered message types", () => {
    expect(contract.registryTypes).toHaveLength(20);
    expect(contract.registryTypes).toContain("BusinessDayStateChanged");
  });

  it("registers BusinessDayStateChanged as an Edge to Cloud, project-only Store fact at 1.0", () => {
    expect(contract.registryEntry("BusinessDayStateChanged")).toMatchObject({
      contractVersion: "1.0",
      producerMode: "EDGE",
      consumerMode: "CLOUD",
      ownerClass: "STORE_TRANSACTION_FACT",
      applyMode: "PROJECT_ONLY",
      targetModule: "Cash & Business Day",
    });
  });
});

describe("the BusinessDayStateChanged fixture against the frozen OpenAPI component", () => {
  it("validates, with the registry-derived and fixture-supplied fields in place", () => {
    const message = goodMessage();
    expect(contract.validateMessage(message)).toEqual({ valid: true, errors: [] });
    expect(wireFormatProblems(message)).toEqual([]);
    expect(evaluateCompatibility(contract, message).kind).toBe("COMPATIBLE");
    expect(message).toMatchObject({
      ownerClass: "STORE_TRANSACTION_FACT",
      sourceMode: "EDGE",
      contractVersion: "1.0",
      storeId: fixture.side.storeId,
      sourceIdentity: "fixture-source-identity",
    });
  });

  it("carries an explicit occurrence time that is not the outbox created_at", () => {
    const message = goodMessage();
    expect(message["occurredAt"]).toBe(fixture.side.occurredAt.toISOString());
    expect(fixture.side.occurredAt.getTime()).not.toBe(createdAtFor(1).getTime());
  });

  it("rejects an extra envelope property, a missing field and a bad payload", () => {
    const extra = { ...goodMessage(), surprise: true };
    expect(contract.validateMessage(extra).valid).toBe(false);

    const missing = goodMessage();
    delete missing["occurredAt"];
    expect(contract.validateMessage(missing).valid).toBe(false);

    const badPayload = goodMessage();
    badPayload["payload"] = { ...fixture.payload, sourceVersion: -1 };
    expect(contract.validateMessage(badPayload).valid).toBe(false);

    const extraPayload = goodMessage();
    extraPayload["payload"] = { ...fixture.payload, extra: 1 };
    expect(contract.validateMessage(extraPayload).valid).toBe(false);

    const wrongType = goodMessage();
    wrongType["payload"] = { ...fixture.payload, status: 7 };
    expect(contract.validateMessage(wrongType).valid).toBe(false);
  });

  it("catches malformed uuid, date and date-time values that the schema pass does not", () => {
    const badId = { ...goodMessage(), messageId: "not-a-uuid" };
    expect(contract.validateMessage(badId).valid).toBe(true);
    expect(wireFormatProblems(badId)).toContain("messageId is not a uuid");

    const badTime = { ...goodMessage(), occurredAt: "yesterday" };
    expect(wireFormatProblems(badTime)).toContain("occurredAt is not a date-time");

    const badDate = goodMessage();
    badDate["payload"] = { ...fixture.payload, businessDate: "2026-13-45" };
    expect(wireFormatProblems(badDate)).toContain("payload.businessDate is not a date");
  });
});

describe("compatibility decisions made by the harness", () => {
  it("quarantines a version that is not the declared one", () => {
    const message = { ...goodMessage(), contractVersion: "2.0" };
    expect(contract.validateMessage(message).valid).toBe(false);
    expect(evaluateCompatibility(contract, message)).toMatchObject({
      kind: "QUARANTINE",
      code: "SYNC_MESSAGE_INCOMPATIBLE",
    });
  });

  it("quarantines an unregistered message type", () => {
    const message = { ...goodMessage(), messageType: "NotARegisteredType" };
    expect(evaluateCompatibility(contract, message)).toMatchObject({
      kind: "QUARANTINE",
      code: "SYNC_MESSAGE_INCOMPATIBLE",
    });
  });

  it("quarantines an ownership or source-mode mismatch", () => {
    expect(
      evaluateCompatibility(contract, {
        ...goodMessage(),
        ownerClass: "CLOUD_MANAGED_CONFIGURATION",
      }),
    ).toMatchObject({ kind: "QUARANTINE", code: "SYNC_OWNERSHIP_VIOLATION" });
    expect(
      evaluateCompatibility(contract, { ...goodMessage(), sourceMode: "CLOUD" }),
    ).toMatchObject({
      kind: "QUARANTINE",
      code: "SYNC_OWNERSHIP_VIOLATION",
    });
  });

  it("rejects structurally invalid or non-object messages without quarantining them", () => {
    expect(evaluateCompatibility(contract, { ...goodMessage(), surprise: 1 })).toMatchObject({
      kind: "REJECT",
      code: "VALIDATION_FAILED",
    });
    expect(evaluateCompatibility(contract, "text")).toMatchObject({ kind: "REJECT" });
    expect(evaluateCompatibility(contract, { messageId: "x" })).toMatchObject({ kind: "REJECT" });
  });
});

describe("fixture scoping", () => {
  it("builds fixtures for another tenant that share nothing with the default tenant", () => {
    const other = businessDayFixture(1, { tenantId: OTHER_TENANT_ID });
    expect(other.tenantId).not.toBe(TEST_TENANT_ID);
    expect(other.eventId).toBe(fixture.eventId);
  });
});
