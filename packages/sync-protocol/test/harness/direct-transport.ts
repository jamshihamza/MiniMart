/**
 * MM-010 TEST-ONLY in-process transport: calls a Cloud ingest directly, as a fixed test peer.
 * No network, no authentication.
 */
import type { IngestPort } from "./cloud-ingest.js";
import type { PushRequest, PushResult, PushTransport } from "./transport.js";

export class DirectIngestTransport implements PushTransport {
  constructor(
    private readonly ingest: IngestPort,
    private readonly peerId: string,
  ) {}

  push(request: PushRequest): Promise<PushResult> {
    return this.ingest.push(request, this.peerId);
  }
}
