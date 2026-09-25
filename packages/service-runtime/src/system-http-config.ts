import { readFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";

import type { EnrolledDevice, SystemHttpOptions } from "./system-http.js";

interface EnrollmentFile {
  devices: { fingerprint256: string; counterId: string; revoked: boolean }[];
}

function enrollmentFile(value: unknown): EnrollmentFile {
  if (typeof value !== "object" || value === null || !("devices" in value)) {
    throw new Error("MM-006 development enrollment registry is invalid");
  }
  const devices = value.devices;
  if (!Array.isArray(devices) || devices.length === 0) {
    throw new Error("MM-006 development enrollment registry has no devices");
  }
  for (const device of devices as unknown[]) {
    if (typeof device !== "object" || device === null) throw new Error("Invalid enrollment");
    const record = device as Record<string, unknown>;
    if (
      typeof record["fingerprint256"] !== "string" ||
      !/^(?:[0-9A-F]{2}:){31}[0-9A-F]{2}$/i.test(record["fingerprint256"]) ||
      typeof record["counterId"] !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        record["counterId"],
      ) ||
      typeof record["revoked"] !== "boolean"
    ) {
      throw new Error("Invalid enrollment");
    }
  }
  return value as EnrollmentFile;
}

export function loadDevelopmentSystemHttpOptions(
  environment: NodeJS.ProcessEnv = process.env,
): SystemHttpOptions | undefined {
  const directory = environment["MINIMART_MM006_DEV_CERT_DIR"];
  if (directory === undefined) return undefined;
  if (
    environment["MINIMART_MM006_ENABLE_DEV_TLS"] !== "1" ||
    environment["NODE_ENV"] === "production" ||
    !isAbsolute(directory)
  ) {
    throw new Error("MM-006 development TLS requires an explicit non-production configuration");
  }
  if (readFileSync(join(directory, "PHASE0_DEV_ONLY"), "utf8").trim() !== "MM-006") {
    throw new Error("MM-006 development TLS marker is invalid");
  }
  const enrollment = enrollmentFile(
    JSON.parse(readFileSync(join(directory, "enrollments.json"), "utf8")) as unknown,
  );
  const enrolledDevices = new Map<string, EnrolledDevice>();
  for (const device of enrollment.devices) {
    const key = device.fingerprint256.replaceAll(":", "").toUpperCase();
    if (enrolledDevices.has(key)) throw new Error("Duplicate enrolled device fingerprint");
    enrolledDevices.set(key, { counterId: device.counterId, revoked: device.revoked });
  }
  const port = Number(environment["MINIMART_SYSTEM_HTTPS_PORT"] ?? "3443");
  if (!Number.isSafeInteger(port) || port < 1 || port > 65535) {
    throw new Error("MINIMART_SYSTEM_HTTPS_PORT must be a valid port");
  }
  const passphrase = environment["MINIMART_MM006_DEV_PFX_PASSWORD"];
  if (passphrase === undefined || passphrase.length === 0) {
    throw new Error("MM-006 development server certificate password is missing");
  }
  return {
    tls: {
      pfx: readFileSync(join(directory, "server.pfx")),
      passphrase,
      ca: readFileSync(join(directory, "ca.cer")),
    },
    host: environment["MINIMART_SYSTEM_BIND_HOST"] ?? "127.0.0.1",
    port,
    enrolledDevices,
  };
}
