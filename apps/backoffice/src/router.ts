import { useMemo, useSyncExternalStore } from "react";

/** A minimal hash route. No routing library is used for this visual-only preview. */
export interface Route {
  readonly segments: readonly string[];
  readonly params: URLSearchParams;
}

export function parseHash(hash: string): Route {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const queryStart = raw.indexOf("?");
  const pathPart = queryStart === -1 ? raw : raw.slice(0, queryStart);
  const query = queryStart === -1 ? "" : raw.slice(queryStart + 1);
  const segments = pathPart.split("/").filter((segment) => segment !== "");
  return { segments, params: new URLSearchParams(query) };
}

export function routeHref(
  segments: readonly string[],
  params: Readonly<Record<string, string>> = {},
): string {
  const query = new URLSearchParams(params).toString();
  return `#/${segments.join("/")}${query === "" ? "" : `?${query}`}`;
}

function subscribe(listener: () => void): () => void {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
}

function currentHash(): string {
  return window.location.hash;
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, currentHash, () => "");
  return useMemo(() => parseHash(hash), [hash]);
}
