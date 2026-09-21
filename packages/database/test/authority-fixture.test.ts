import { describe, expect, it } from "vitest";

import {
  applyCrDb002,
  applyCrDb003,
  CR_DB_002_INVALID_STATEMENT,
  CR_DB_003_INLINE_FOREIGN_KEY,
  effectiveAuthorityDdl,
} from "./support/authority-fixture.js";

describe("CR-DB-002 authority overlay", () => {
  it("removes only the approved invalid constraint from the frozen authority", async () => {
    const effective = await effectiveAuthorityDdl();
    expect(effective).not.toContain(CR_DB_002_INVALID_STATEMENT);
    expect(effective).toContain("tenant_id uuid PRIMARY KEY");
    expect(effective).not.toContain("UNIQUE (tenant_id)\n");
  });

  it("fails when the statement is absent", () => {
    expect(() => applyCrDb002("CREATE TABLE org.tenants (tenant_id uuid PRIMARY KEY);")).toThrow(
      "found 0",
    );
  });

  it("fails when the statement appears more than once", async () => {
    const effective = await effectiveAuthorityDdl();
    const duplicated = `${effective}\n${CR_DB_002_INVALID_STATEMENT}\n${CR_DB_002_INVALID_STATEMENT}`;
    expect(() => applyCrDb002(duplicated)).toThrow("found 2");
  });

  it("fails when the surrounding org.tenants definition changes", async () => {
    const effective = await effectiveAuthorityDdl();
    const reconstructed = effective.replace(
      "version bigint NOT NULL DEFAULT 0\n);",
      `version bigint NOT NULL DEFAULT 1,\n${CR_DB_002_INVALID_STATEMENT}\n);`,
    );
    expect(() => applyCrDb002(reconstructed)).toThrow("structure does not match");
  });
});

describe("CR-DB-003 authority overlay", () => {
  it("moves the exact FK after its referenced table without changing its semantics", async () => {
    const effective = await effectiveAuthorityDdl();
    expect(effective).not.toContain(CR_DB_003_INLINE_FOREIGN_KEY);
    const targetPosition = effective.indexOf("CREATE TABLE returns.refund_obligations");
    const deferredPosition = effective.indexOf("ALTER TABLE payments.refund_executions");
    expect(targetPosition).toBeGreaterThan(-1);
    expect(deferredPosition).toBeGreaterThan(targetPosition);
    expect(effective).toContain(
      "ADD FOREIGN KEY (tenant_id, refund_obligation_id)\nREFERENCES returns.refund_obligations(tenant_id, refund_obligation_id);",
    );
  });

  it("fails when the inline FK is absent", () => {
    expect(() => applyCrDb003("CREATE TABLE payments.refund_executions ();")).toThrow("found 0");
  });

  it("fails when the inline FK appears more than once", () => {
    expect(() =>
      applyCrDb003(`${CR_DB_003_INLINE_FOREIGN_KEY}\n${CR_DB_003_INLINE_FOREIGN_KEY}`),
    ).toThrow("found 2");
  });
});
