export type MigrationOutcome = "STARTED" | "COMPLETED" | "FAILED";

export interface MigrationManifestEntry {
  readonly id: string;
  readonly module: string;
  readonly schemaVersion: string;
  readonly minimumApplicationBuild: string;
  readonly maximumApplicationBuild: string;
  readonly resumable: boolean;
  readonly transactionSafe: boolean;
  readonly file: string;
}

export interface MigrationDefinition extends MigrationManifestEntry {
  readonly bytes: Uint8Array;
  readonly sql: string;
  readonly checksumSha256: string;
}

export interface MigrationLedgerRow {
  readonly migrationId: string;
  readonly module: string;
  readonly schemaVersion: string;
  readonly checksumSha256: string;
  readonly startedAt: Date;
  readonly completedAt: Date | null;
  readonly minimumApplicationBuild: string;
  readonly maximumApplicationBuild: string;
  readonly outcome: MigrationOutcome;
  readonly resumable: boolean;
  readonly failureMessage: string | null;
}

export interface MigrationRunResult {
  readonly applied: readonly string[];
  readonly alreadyCurrent: readonly string[];
  readonly schemaVersion: string | null;
}
