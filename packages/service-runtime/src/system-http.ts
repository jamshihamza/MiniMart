import { createServer, type Server as HttpsServer, type ServerOptions } from "node:https";
import { randomUUID } from "node:crypto";
import type { AddressInfo } from "node:net";
import type { TLSSocket } from "node:tls";

import type { LivenessResult, ServiceReadinessResult } from "./runtime.js";

export interface SystemStatusSource {
  liveness(): LivenessResult;
  readiness(): ServiceReadinessResult | Promise<ServiceReadinessResult>;
}

export interface EnrolledDevice {
  readonly counterId: string;
  readonly revoked: boolean;
}

export interface SystemHttpOptions {
  readonly tls: Pick<ServerOptions, "pfx" | "passphrase" | "ca">;
  readonly host: string;
  readonly port: number;
  readonly enrolledDevices: ReadonlyMap<string, EnrolledDevice>;
}

function fingerprint(value: string): string {
  return value.replaceAll(":", "").toUpperCase();
}

function problem(status: 401 | 503) {
  return {
    type: "about:blank",
    title: status === 401 ? "Authentication required" : "Service unavailable",
    status,
    code: status === 401 ? "AUTHENTICATION_REQUIRED" : "SERVICE_UNAVAILABLE",
    category: status === 401 ? "AUTHENTICATION" : "INFRASTRUCTURE",
    correlationId: randomUUID(),
  };
}

export function isEnrolledDevice(
  authorized: boolean,
  certificateFingerprint: string,
  devices: ReadonlyMap<string, EnrolledDevice>,
): boolean {
  const device = devices.get(fingerprint(certificateFingerprint));
  return authorized && device !== undefined && !device.revoked;
}

export async function systemResponse(
  path: string | undefined,
  source: SystemStatusSource,
): Promise<
  | LivenessResult
  | {
      transactionalReady: boolean;
      databaseReady: boolean;
      schemaCompatible: boolean;
      reasons: readonly string[];
    }
  | null
> {
  if (path === "/api/v1/system/health") return source.liveness();
  if (path === "/api/v1/system/readiness") {
    const { transactionalReady, databaseReady, schemaCompatible, reasons } =
      await source.readiness();
    return { transactionalReady, databaseReady, schemaCompatible, reasons };
  }
  return null;
}

export class StoreSystemHttpServer {
  readonly #server: HttpsServer;
  #listening = false;

  constructor(source: SystemStatusSource, options: SystemHttpOptions) {
    this.#server = createServer(
      {
        ...options.tls,
        requestCert: true,
        rejectUnauthorized: true,
        minVersion: "TLSv1.2",
      },
      (request, response) => {
        void (async () => {
          response.setHeader("Cache-Control", "no-store");
          const socket = request.socket as TLSSocket;
          const certificate = socket.getPeerCertificate();
          if (
            !isEnrolledDevice(
              socket.authorized,
              certificate.fingerprint256 ?? "",
              options.enrolledDevices,
            )
          ) {
            response.writeHead(401, { "Content-Type": "application/problem+json" });
            response.end(JSON.stringify(problem(401)));
            return;
          }
          if (request.method !== "GET") {
            response.writeHead(404);
            response.end();
            return;
          }
          const body = await systemResponse(request.url, source);
          if (body === null) {
            response.writeHead(404);
            response.end();
            return;
          }
          response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          response.end(JSON.stringify(body));
        })().catch(() => {
          if (!response.headersSent) {
            response.writeHead(503, { "Content-Type": "application/problem+json" });
          }
          response.end(JSON.stringify(problem(503)));
        });
      },
    );
    this.#server.requestTimeout = 5_000;
    this.#server.headersTimeout = 5_000;
    this.#server.keepAliveTimeout = 1_000;
    this.host = options.host;
    this.port = options.port;
  }

  readonly host: string;
  readonly port: number;

  get address(): AddressInfo | null {
    const address = this.#server.address();
    return typeof address === "object" ? address : null;
  }

  async start(): Promise<void> {
    if (this.#listening) return;
    await new Promise<void>((resolve, reject) => {
      this.#server.once("error", reject);
      this.#server.listen(this.port, this.host, () => {
        this.#server.off("error", reject);
        this.#listening = true;
        resolve();
      });
    });
  }

  async close(): Promise<void> {
    if (!this.#listening) return;
    await new Promise<void>((resolve, reject) => {
      this.#server.close((error) => (error === undefined ? resolve() : reject(error)));
      this.#server.closeAllConnections();
    });
    this.#listening = false;
  }
}
