/**
 * MM-010 TEST-ONLY transport types and fault injection. Not a sync client and not production code.
 */
import type { ProblemCodeUsed } from "./frozen-contract.js";

/** The `SyncMessage` envelope, with every field this harness sends spelled out. */
export interface WireMessage {
  readonly messageId: string;
  readonly messageType: string;
  readonly contractVersion: string;
  readonly ownerClass: string;
  readonly tenantId: string;
  readonly storeId: string | null;
  readonly sourceMode: string;
  readonly sourceIdentity: string;
  readonly postingEnvelopeId: string | null;
  readonly correlationId: string | null;
  readonly causationId: string | null;
  readonly occurredAt: string;
  readonly payload: unknown;
}

export interface PushRequest {
  readonly peerId: string;
  readonly messages: readonly WireMessage[];
}

export type SyncOutcome = "APPLIED" | "DUPLICATE" | "QUARANTINED" | "REJECTED";

export interface PushResultItem {
  readonly messageId: string;
  readonly outcome: SyncOutcome;
  readonly problem: { readonly code: ProblemCodeUsed; readonly detail: string } | null;
}

export interface PushResult {
  readonly results: readonly PushResultItem[];
}

export interface PushTransport {
  push(request: PushRequest): Promise<PushResult>;
}

/** Anything that stops a push from returning a usable result: a lost request, response or outage. */
export class TransportError extends Error {
  constructor(
    readonly kind: "REQUEST_LOST" | "RESPONSE_LOST" | "CLOUD_DOWN" | "HTTP_STATUS" | "BAD_RESPONSE",
    message: string,
  ) {
    super(message);
    this.name = "TransportError";
  }
}

/** Thrown by hooks to model a process dying at that point. The dispatcher must not clean up. */
export class SimulatedCrash extends Error {
  constructor(message = "simulated crash") {
    super(message);
    this.name = "SimulatedCrash";
  }
}

export type Fault = "NONE" | "LOSE_REQUEST" | "LOSE_RESPONSE" | "CLOUD_DOWN";

/**
 * Wraps a transport and applies one fault per call from a plan, then `fallback`. `LOSE_RESPONSE`
 * delivers the request to the inner transport (so the Cloud may commit) and then fails, which is the
 * lost-ACK case. `LOSE_REQUEST` and `CLOUD_DOWN` never reach the inner transport.
 */
export class FaultInjectingTransport implements PushTransport {
  calls = 0;
  deliveredToInner = 0;
  readonly seenMessageIds: string[] = [];

  constructor(
    private readonly inner: PushTransport,
    private readonly plan: Fault[] = [],
    private readonly fallback: Fault = "NONE",
  ) {}

  async push(request: PushRequest): Promise<PushResult> {
    this.calls += 1;
    const fault = this.plan.shift() ?? this.fallback;
    if (fault === "LOSE_REQUEST") throw new TransportError("REQUEST_LOST", "request lost");
    if (fault === "CLOUD_DOWN") throw new TransportError("CLOUD_DOWN", "connection refused");
    this.deliveredToInner += 1;
    for (const message of request.messages) this.seenMessageIds.push(message.messageId);
    const result = await this.inner.push(request);
    if (fault === "LOSE_RESPONSE") throw new TransportError("RESPONSE_LOST", "response lost");
    return result;
  }
}

/** Reverses the message order inside each request. Used only to show delivery-order independence. */
export class ReversingTransport implements PushTransport {
  constructor(private readonly inner: PushTransport) {}

  push(request: PushRequest): Promise<PushResult> {
    return this.inner.push({ ...request, messages: [...request.messages].reverse() });
  }
}

/** Holds each push until `release()` is called. Used to keep a claim held while another worker runs. */
export class GatedTransport implements PushTransport {
  private release!: () => void;
  readonly started: Promise<void>;
  private markStarted!: () => void;
  private readonly gate: Promise<void>;

  constructor(private readonly inner: PushTransport) {
    this.gate = new Promise<void>((resolve) => {
      this.release = resolve;
    });
    this.started = new Promise<void>((resolve) => {
      this.markStarted = resolve;
    });
  }

  open(): void {
    this.release();
  }

  async push(request: PushRequest): Promise<PushResult> {
    this.markStarted();
    await this.gate;
    return this.inner.push(request);
  }
}

/** Records every request it forwards. Used to prove identity and payload stay stable across retries. */
export class RecordingTransport implements PushTransport {
  readonly requests: PushRequest[] = [];

  constructor(private readonly inner: PushTransport) {}

  push(request: PushRequest): Promise<PushResult> {
    this.requests.push(request);
    return this.inner.push(request);
  }
}
