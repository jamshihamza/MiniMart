/**
 * MM-010 TEST-ONLY loopback server and client. TEST ONLY: never a production Cloud listener.
 *
 * - It lives only under `packages/sync-protocol/test/`, outside `src`, outside the package exports
 *   and outside every launcher.
 * - It has no host option: it binds `127.0.0.1` on an ephemeral port and checks that after binding.
 * - Every response carries `x-minimart-test-only: true`.
 * - Identity is a FIXED server-side test constant (`TEST_STORE_PEER_ID`). A request body whose
 *   `peerId` differs is refused, but nothing is authenticated: there is no mTLS, no enrollment lookup
 *   and no authorization. No security or authentication acceptance can be claimed from this server.
 * - Only `POST /sync/v1/messages:push` exists. `pull`, `ack` and `compatibility` are not implemented
 *   and are not claimed.
 */
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";

import { TEST_STORE_PEER_ID } from "./fixtures.js";
import type { IngestPort } from "./cloud-ingest.js";
import {
  TransportError,
  type PushRequest,
  type PushResult,
  type PushTransport,
} from "./transport.js";

export const LOOPBACK_HOST = "127.0.0.1";
export const PUSH_PATH = "/sync/v1/messages:push";
const MAX_BODY_BYTES = 5 * 1024 * 1024;

function sendJson(response: ServerResponse, status: number, body: unknown): void {
  const text = JSON.stringify(body);
  response.writeHead(status, {
    "content-type": status >= 400 ? "application/problem+json" : "application/json",
    "content-length": Buffer.byteLength(text),
    "x-minimart-test-only": "true",
  });
  response.end(text);
}

function problem(status: number, code: string, title: string): Record<string, unknown> {
  return {
    type: "about:blank",
    title,
    status,
    code,
    category: status >= 500 ? "INFRASTRUCTURE" : "VALIDATION",
    correlationId: "test-only",
  };
}

async function readBody(request: IncomingMessage): Promise<string | undefined> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = chunk as Buffer;
    size += buffer.length;
    if (size > MAX_BODY_BYTES) return undefined;
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

export class TestOnlyLoopbackIngestServer {
  private server: Server | undefined;

  constructor(private readonly ingest: IngestPort) {}

  async start(): Promise<{ readonly port: number; readonly url: string }> {
    const server = createServer((request, response) => {
      void this.handle(request, response).catch(() => {
        if (!response.headersSent)
          sendJson(response, 500, problem(500, "SERVICE_UNAVAILABLE", "test-only failure"));
        else response.end();
      });
    });
    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.listen({ host: LOOPBACK_HOST, port: 0 }, () => resolve());
    });
    const address = server.address() as AddressInfo | null;
    if (address === null || address.address !== LOOPBACK_HOST) {
      await new Promise<void>((resolve) => server.close(() => resolve()));
      throw new Error("test-only server must bind only 127.0.0.1");
    }
    this.server = server;
    return { port: address.port, url: `http://${LOOPBACK_HOST}:${address.port}` };
  }

  async stop(): Promise<void> {
    const server = this.server;
    this.server = undefined;
    if (server === undefined) return;
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error === undefined ? resolve() : reject(error)));
      server.closeAllConnections();
    });
  }

  private async handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const path = (request.url ?? "").split("?")[0];
    if (path !== PUSH_PATH) {
      sendJson(
        response,
        404,
        problem(404, "RESOURCE_NOT_FOUND", "only push exists in this test-only server"),
      );
      return;
    }
    if (request.method !== "POST") {
      sendJson(response, 405, problem(405, "INVALID_REQUEST", "push accepts POST only"));
      return;
    }
    const text = await readBody(request);
    if (text === undefined) {
      sendJson(response, 413, problem(413, "INVALID_REQUEST", "body too large"));
      return;
    }
    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      sendJson(response, 400, problem(400, "INVALID_REQUEST", "body is not JSON"));
      return;
    }
    const record = body as { peerId?: unknown; messages?: unknown } | null;
    if (record === null || typeof record !== "object" || !Array.isArray(record.messages)) {
      sendJson(response, 400, problem(400, "INVALID_REQUEST", "peerId and messages are required"));
      return;
    }
    if (record.messages.length < 1 || record.messages.length > 500) {
      sendJson(response, 400, problem(400, "INVALID_REQUEST", "messages must hold 1 to 500 items"));
      return;
    }
    if (record.peerId !== TEST_STORE_PEER_ID) {
      sendJson(
        response,
        400,
        problem(400, "INVALID_REQUEST", "peerId does not match the fixed test identity"),
      );
      return;
    }
    const result = await this.ingest.push(body, TEST_STORE_PEER_ID);
    sendJson(response, 200, result);
  }
}

/**
 * Client side of the same experiment. Any non-200 reply or unreadable body is a transport failure.
 * The dispatcher addresses the REMOTE peer in `request.peerId`, while this server checks the body
 * against its fixed test identity. This harness choice sends that fixed identity on the wire; which
 * peer the frozen `peerId` field names stays an OPEN contract question.
 */
export class HttpPushTransport implements PushTransport {
  constructor(
    private readonly baseUrl: string,
    /** The peerId put on the wire; null sends the request's own peerId unchanged. */
    private readonly wirePeerId: string | null = TEST_STORE_PEER_ID,
  ) {}

  async push(request: PushRequest): Promise<PushResult> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${PUSH_PATH}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...request, peerId: this.wirePeerId ?? request.peerId }),
      });
    } catch (error) {
      throw new TransportError(
        "CLOUD_DOWN",
        error instanceof Error ? error.message : String(error),
      );
    }
    if (response.status !== 200) {
      throw new TransportError("HTTP_STATUS", `status ${response.status}`);
    }
    const parsed = (await response.json()) as PushResult | null;
    if (parsed === null || !Array.isArray(parsed.results)) {
      throw new TransportError("BAD_RESPONSE", "response has no results array");
    }
    return parsed;
  }
}
