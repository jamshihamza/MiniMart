import { invoke, isTauri } from "@tauri-apps/api/core";

import type { SystemStatusProbe } from "./connectivity.js";

export async function probeStoreNode(): Promise<SystemStatusProbe> {
  if (!isTauri()) throw new Error("Native Store Node transport is unavailable");
  return invoke<SystemStatusProbe>("check_store_node");
}
