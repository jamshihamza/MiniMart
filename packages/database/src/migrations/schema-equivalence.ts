import { isDeepStrictEqual } from "node:util";

import type { NormalizedPostgresCatalog } from "./schema-introspection.js";

export interface SchemaEquivalenceResult {
  readonly equivalent: boolean;
  readonly differingSections: readonly (keyof NormalizedPostgresCatalog)[];
}

export function comparePostgresCatalogs(
  authority: NormalizedPostgresCatalog,
  candidate: NormalizedPostgresCatalog,
): SchemaEquivalenceResult {
  const sections = Object.keys(authority) as (keyof NormalizedPostgresCatalog)[];
  const differingSections = sections.filter(
    (section) => !isDeepStrictEqual(authority[section], candidate[section]),
  );
  return { equivalent: differingSections.length === 0, differingSections };
}
