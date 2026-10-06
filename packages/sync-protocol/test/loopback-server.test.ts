/**
 * MM-010 TEST-ONLY: the loopback experiment, exercised with a stub ingest (no database). It shows
 * the server is restricted to 127.0.0.1 on an ephemeral port and uses a fixed test identity. It makes
 * no authentication, enrollment, mTLS or authorization claim.
 */
import { afterEach, describe, expect, it } from "vitest";

import type { IngestPort } from "./harness/cloud-ingest.js";
import { businessDayFixture, TEST_CLOUD_PEER_ID, TEST_STORE_PEER_ID } from "./harness/fixtures.js";
import { loadFrozenContract } from "./harness/frozen-contract.js";
import {
  HttpPushTransport,
  LOOPBACK_HOST,
  PUSH_PATH,
  TestOnlyLoopbackIngestServer,
} from "./harness/loopback-server.js";
import { TransportError, type PushResult } from "./harness/transport.js";
import { envelopeFromFixture } from "./harness/wiring.js";

const contract = loadFrozenContract();

function stubIngest(): { port: IngestPort; calls: { request: unknown; peerId: string }[] } {
  const calls: { request: unknown; peerId: string }[] = [];
  const port: IngestPort = {
    push(request, peerId): Promise<PushResult> {
      calls.push({ request, peerId });
      const messages = (request as { messages: { messageId: string }[] }).messages;
      return Promise.resolve({
        results: messages.map((message) => ({
          messageId: message.messageId,
          outcome: "APPLIED" as const,
          problem: null,
        })),
      });
    },
  };
  return { port, calls };
}

const servers: TestOnlyLoopbackIngestServer[] = [];
async function startServer(ingest: IngestPort): Promise<{ url: string; port: number }> {
  const server = new TestOnlyLoopbackIngestServer(ingest);
  servers.push(server);
  return server.start();
}
afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => server.stop()));
});

const post = (url: string, body: unknown, method = "POST"): Promise<Response> =>
  fetch(`${url}${PUSH_PATH}`, {
    method,
    headers: { "content-type": "application/json" },
    ...(method === "POST" ? { body: typeof body === "string" ? body : JSON.stringify(body) } : {}),
  });

const goodRequest = (): { peerId: string; messages: unknown[] } => ({
  peerId: TEST_STORE_PEER_ID,
  messages: [envelopeFromFixture(contract, businessDayFixture(1))],
});

describe("the loopback server is test-only and loopback-only", () => {
  it("has no host option and binds 127.0.0.1 on an ephemeral port", async () => {
    expect(TestOnlyLoopbackIngestServer.length).toBe(1);
    expect(LOOPBACK_HOST).toBe("127.0.0.1");
    const first = await startServer(stubIngest().port);
    const second = await startServer(stubIngest().port);
    expect(new URL(first.url).hostname).toBe("127.0.0.1");
    expect(first.port).toBeGreaterThan(0);
    expect(second.port).not.toBe(first.port);
  });

  it("marks every response as test-only", async () => {
    const { url } = await startServer(stubIngest().port);
    for (const response of [
      await post(url, goodRequest()),
      await post(url, "{ not json"),
      await fetch(`${url}/anything-else`),
    ]) {
      expect(response.headers.get("x-minimart-test-only")).toBe("true");
    }
  });

  it("serves only push: pull, ack and compatibility are not implemented and are not claimed", async () => {
    const { url } = await startServer(stubIngest().port);
    for (const route of [
      "/sync/v1/messages:pull",
      "/sync/v1/messages:ack",
      "/sync/v1/compatibility",
    ]) {
      expect((await fetch(`${url}${route}`)).status).toBe(404);
    }
    expect((await post(url, goodRequest(), "GET")).status).toBe(405);
  });
});

describe("fixed server-side test identity", () => {
  it("passes a push to the ingest as the fixed test peer", async () => {
    const stub = stubIngest();
    const { url } = await startServer(stub.port);
    const response = await post(url, goodRequest());
    expect(response.status).toBe(200);
    const body = (await response.json()) as PushResult;
    expect(body.results).toHaveLength(1);
    expect(body.results[0]?.outcome).toBe("APPLIED");
    expect(stub.calls).toHaveLength(1);
    expect(stub.calls[0]?.peerId).toBe(TEST_STORE_PEER_ID);
  });

  it("puts the fixed test identity on the wire by default and the request's own peerId on null", async () => {
    // The dispatcher addresses the REMOTE peer; which peer the frozen peerId names is an OPEN gap.
    // This only pins the harness choice: default client sends the fixed identity, null sends as is.
    const stub = stubIngest();
    const { url } = await startServer(stub.port);
    const request = { peerId: TEST_CLOUD_PEER_ID, messages: goodRequest().messages };

    await new HttpPushTransport(url).push(request as never);
    expect(stub.calls).toHaveLength(1);
    expect((stub.calls[0]?.request as { peerId: string }).peerId).toBe(TEST_STORE_PEER_ID);
    expect(stub.calls[0]?.peerId).toBe(TEST_STORE_PEER_ID);

    await expect(new HttpPushTransport(url, null).push(request as never)).rejects.toBeInstanceOf(
      TransportError,
    );
    expect(stub.calls).toHaveLength(1);
  });

  it("refuses a body whose peerId is not the fixed test identity, without calling the ingest", async () => {
    const stub = stubIngest();
    const { url } = await startServer(stub.port);
    const response = await post(url, {
      ...goodRequest(),
      peerId: "018f0000-0003-7000-8000-0000000000ff",
    });
    expect(response.status).toBe(400);
    expect(stub.calls).toHaveLength(0);
  });

  it("refuses malformed bodies and out-of-range batch sizes", async () => {
    const stub = stubIngest();
    const { url } = await startServer(stub.port);
    expect((await post(url, "{ not json")).status).toBe(400);
    expect((await post(url, { peerId: TEST_STORE_PEER_ID })).status).toBe(400);
    expect((await post(url, { peerId: TEST_STORE_PEER_ID, messages: [] })).status).toBe(400);
    const oversized = Array.from({ length: 501 }, () => ({}));
    expect((await post(url, { peerId: TEST_STORE_PEER_ID, messages: oversized })).status).toBe(400);
    expect(stub.calls).toHaveLength(0);
  });
});

describe("the HTTP client side of the experiment", () => {
  it("returns per-message results from the server", async () => {
    const { url } = await startServer(stubIngest().port);
    const transport = new HttpPushTransport(url);
    const result = await transport.push(goodRequest() as never);
    expect(result.results.map((item) => item.outcome)).toEqual(["APPLIED"]);
  });

  it("treats a refused connection as a transport failure", async () => {
    const server = new TestOnlyLoopbackIngestServer(stubIngest().port);
    const { url } = await server.start();
    await server.stop();
    await expect(new HttpPushTransport(url).push(goodRequest() as never)).rejects.toMatchObject({
      name: "TransportError",
      kind: "CLOUD_DOWN",
    });
  });

  it("treats a non-200 reply as a transport failure and keeps the 409 question open", async () => {
    const { url } = await startServer(stubIngest().port);
    const bad = { ...goodRequest(), peerId: "018f0000-0003-7000-8000-0000000000ff" };
    await expect(new HttpPushTransport(url, null).push(bad as never)).rejects.toBeInstanceOf(
      TransportError,
    );
  });
});
