export { databaseConfigFromEnvironment, type DatabaseConfig } from "./config.js";
export { checkDatabaseHealth, type DatabaseHealth } from "./health.js";
export {
  createDatabasePool,
  createDatabaseRuntime,
  type DatabaseRuntime,
  type MiniMartDatabase,
} from "./pool.js";
export {
  assessDatabaseReadiness,
  type DatabaseReadiness,
  type DatabaseReadinessOptions,
} from "./readiness.js";
export {
  compareSemanticVersions,
  isApplicationBuildCompatible,
  parseSemanticVersion,
} from "./schema-version.js";
export { sha256Hex } from "./migrations/checksum.js";
export { DEFAULT_MIGRATIONS_DIRECTORY, discoverMigrations } from "./migrations/discovery.js";
export {
  bootstrapMigrationLedger,
  MIGRATION_LEDGER_DDL,
  MIGRATION_LEDGER_TABLE,
  readMigrationLedger,
} from "./migrations/ledger.js";
export {
  acquireMigrationLock,
  deriveMigrationLockIdentifier,
  MIGRATION_LOCK_IDENTIFIER,
  MIGRATION_LOCK_NAMESPACE,
  releaseMigrationLock,
} from "./migrations/lock.js";
export {
  IncompatibleApplicationBuildError,
  InterruptedMigrationError,
  MigrationChecksumMismatchError,
  MigrationError,
  runMigrations,
  type RunMigrationsOptions,
} from "./migrations/runner.js";
export {
  introspectPostgresCatalog,
  MIGRATION_LEDGER_EXCLUSION,
  type NormalizedPostgresCatalog,
} from "./migrations/schema-introspection.js";
export {
  comparePostgresCatalogs,
  type SchemaEquivalenceResult,
} from "./migrations/schema-equivalence.js";
export type {
  MigrationDefinition,
  MigrationLedgerRow,
  MigrationManifestEntry,
  MigrationOutcome,
  MigrationRunResult,
} from "./migrations/types.js";
