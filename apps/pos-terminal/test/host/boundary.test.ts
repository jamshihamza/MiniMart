import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * Source-boundary check for the Back Office workspace package (ADR 0009, D5).
 *
 * This reads source text. It shows that today's Back Office source does not import Tauri, the POS
 * application or a network client. It does NOT prove runtime isolation: Back Office and POS share
 * one window and one Tauri capability scope, and production capability and security design is still
 * pending.
 */
const here = dirname(fileURLToPath(import.meta.url));
const backOfficeSource = join(here, "..", "..", "..", "backoffice", "src");

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const full = join(directory, name);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.(ts|tsx)$/.test(name) ? [full] : [];
  });
}

const FORBIDDEN: readonly (readonly [string, RegExp])[] = [
  ["a Tauri import", /@tauri-apps\//],
  ["a Tauri invoke call", /\binvoke\s*\(/],
  ["the Tauri global", /__TAURI/],
  ["the POS application", /pos-terminal|\.\.\/\.\.\/pos-terminal/],
  ["fetch", /\bfetch\s*\(/],
  ["XMLHttpRequest", /XMLHttpRequest/],
  ["WebSocket", /WebSocket/],
];

describe("Back Office workspace source boundary", () => {
  const files = sourceFiles(backOfficeSource);

  it("finds the Back Office source files", () => {
    expect(files.some((file) => file.endsWith("workspace.tsx"))).toBe(true);
  });

  for (const [what, pattern] of FORBIDDEN) {
    it(`contains no ${what}`, () => {
      for (const file of files) {
        const text = readFileSync(file, "utf8")
          .split("\n")
          .filter((line) => !line.trimStart().startsWith("*") && !line.trimStart().startsWith("//"))
          .join("\n");
        expect(pattern.test(text), `${file} must contain no ${what}`).toBe(false);
      }
    });
  }
});
