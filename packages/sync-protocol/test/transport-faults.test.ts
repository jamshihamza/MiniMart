/**
 * MM-010 TEST-ONLY: fault-injection and retry-policy mechanics, with no database. These show what
 * the harness faults do; they are not delivery evidence. Delivery behavior is exercised against
 * PostgreSQL in the database-dependent tests.
 */
import { describe, expect, it } from "vitest";

import { backoffDelayMs, TEST_FIXTURE_RETRY_POLICY } from "./harness/dispatcher.js";
import {
  FaultInjectingTransport,
  GatedTransport,
  RecordingTransport,
  ReversingTransport,
  SimulatedCrash,
  TransportError,
  type PushRequest,
  type PushResult,
  type PushTransport,
  type WireMessage,
} from "./harness/transport.js";

function message(id: string): WireMessage {
  return {
    messageId: id,
    messageType: "BusinessDayStateChanged",
    contractVersion: "1.0",
    ownerClass: "STORE_TRANSACTION_FACT",
    tenantId: "t",
    storeId: null,
    sourceMode: "EDGE",
    sourceIdentity: "s",
    postingEnvelopeId: null,
    correlationId: null,
    causationId: null,
    occurredAt: "2026-03-14T08:30:00.000Z",
    payload: {},
  };
}

function countingInner(): { inner: PushTransport; seen: PushRequest[] } {
  const seen: PushRequest[] = [];
  return {
    seen,
    inner: {
      push(request): Promise<PushResult> {
        seen.push(request);
        return Promise.resolve({
          results: request.messages.map((item) => ({
            messageId: item.messageId,
            outcome: "APPLIED" as const,
            problem: null,
          })),
        });
      },
    },
  };
}

const request = (...ids: string[]): PushRequest => ({ peerId: "p", messages: ids.map(message) });

describe("fault injection", () => {
  it("applies one planned fault per call, then the fallback", async () => {
    const { inner } = countingInner();
    const transport = new FaultInjectingTransport(inner, ["CLOUD_DOWN", "LOSE_REQUEST"], "NONE");
    await expect(transport.push(request("a"))).rejects.toMatchObject({ kind: "CLOUD_DOWN" });
    await expect(transport.push(request("a"))).rejects.toMatchObject({ kind: "REQUEST_LOST" });
    await expect(transport.push(request("a"))).resolves.toBeDefined();
    expect(transport.calls).toBe(3);
  });

  it("a lost request never reaches the Cloud side", async () => {
    const { inner, seen } = countingInner();
    const transport = new FaultInjectingTransport(inner, ["LOSE_REQUEST"]);
    await expect(transport.push(request("a"))).rejects.toBeInstanceOf(TransportError);
    expect(seen).toHaveLength(0);
    expect(transport.deliveredToInner).toBe(0);
  });

  it("a cloud outage never reaches the Cloud side", async () => {
    const { inner, seen } = countingInner();
    const transport = new FaultInjectingTransport(inner, [], "CLOUD_DOWN");
    await expect(transport.push(request("a"))).rejects.toMatchObject({ kind: "CLOUD_DOWN" });
    expect(seen).toHaveLength(0);
  });

  it("a lost response DOES reach the Cloud side and then fails for the sender", async () => {
    const { inner, seen } = countingInner();
    const transport = new FaultInjectingTransport(inner, ["LOSE_RESPONSE"]);
    await expect(transport.push(request("a", "b"))).rejects.toMatchObject({
      kind: "RESPONSE_LOST",
    });
    expect(seen).toHaveLength(1);
    expect(transport.seenMessageIds).toEqual(["a", "b"]);
  });
});

describe("other transport wrappers", () => {
  it("reverses message order inside a request", async () => {
    const { inner, seen } = countingInner();
    await new ReversingTransport(inner).push(request("a", "b", "c"));
    expect(seen[0]?.messages.map((item) => item.messageId)).toEqual(["c", "b", "a"]);
  });

  it("records every request it forwards", async () => {
    const { inner } = countingInner();
    const recording = new RecordingTransport(inner);
    await recording.push(request("a"));
    await recording.push(request("a"));
    expect(recording.requests).toHaveLength(2);
  });

  it("holds a push until opened", async () => {
    const { inner, seen } = countingInner();
    const gated = new GatedTransport(inner);
    const pending = gated.push(request("a"));
    await gated.started;
    expect(seen).toHaveLength(0);
    gated.open();
    await pending;
    expect(seen).toHaveLength(1);
  });

  it("models a crash as an error the dispatcher must not handle", () => {
    expect(new SimulatedCrash()).toBeInstanceOf(Error);
    expect(new SimulatedCrash().name).toBe("SimulatedCrash");
  });
});

describe("test-fixture retry policy (not production defaults)", () => {
  it("backs off exponentially up to a cap, deterministically and without jitter", () => {
    const delays = [1, 2, 3, 4, 5, 6].map((attempt) =>
      backoffDelayMs(TEST_FIXTURE_RETRY_POLICY, attempt),
    );
    expect(delays).toEqual([1_000, 2_000, 4_000, 8_000, 8_000, 8_000]);
    expect(TEST_FIXTURE_RETRY_POLICY.maxAttempts).toBe(4);
  });
});
