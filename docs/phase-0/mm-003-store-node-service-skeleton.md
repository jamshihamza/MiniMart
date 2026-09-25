# MM-003 Store Node Windows Service Skeleton

## Scope

MM-003 establishes the production-shaped process foundation for Store Node. It contains no
retail workflows, POS connectivity, sync, hardware integration, installer behavior, or business
modules.

## Launcher and runtime boundary

`apps/store-node` is a thin edge composition root. It loads configuration, constructs the shared
runtime, registers process signal handlers, starts the service, and maps fatal failures to a
nonzero process exit code.

`packages/service-runtime` owns the reusable lifecycle, readiness projection, database runtime
composition, structured logging contract, signal registration, and bounded shutdown behavior.
It consumes only the public `@minimart/database` surface.

## Lifecycle

The lifecycle begins at `STOPPED` and supports the explicit states `STARTING`, `RUNNING`,
`DEGRADED`, `STOPPING`, `STOPPED`, and `FAILED`. A transition table controls all changes. Invalid
transitions throw `InvalidLifecycleTransitionError` and leave the current state unchanged.

## Startup sequence

1. The launcher loads and validates typed configuration.
2. It creates a structured console logger and runtime context.
3. The runtime enters `STARTING` and creates the MM-004 database runtime.
4. It calls the MM-004 readiness assessment with the application build.
5. A reachable, migration-complete, compatible schema permits `RUNNING`.
6. A connectivity, ledger, checksum, build-compatibility, or schema-drift failure enters `FAILED`,
   closes partially initialized database resources, and produces a nonzero launcher exit code.

Normal startup does not execute migrations or repair schema.

## Liveness and readiness

Liveness is the process-level `{ status: "UP", time }` result. Transactional readiness is a
separate projection with `status`, `transactionalReady`, `databaseReady`, `schemaCompatible`, and
`reasons`. Transactional readiness is true only while the runtime is `RUNNING` and the accepted
MM-004 readiness result permits writes.

MM-003 exposes these results as runtime methods. It does not add HTTP transport or endpoints;
the frozen backlog assigns Store Node HTTP health connectivity to MM-006.

## Shutdown and Windows Service hosting seam

The launcher maps `SIGINT`, `SIGTERM`, and Windows `SIGBREAK` to one idempotent runtime stop.
Shutdown enters `STOPPING`, closes the database once within the configured timeout, and enters
`STOPPED`. Cleanup failure or timeout enters `FAILED` and sets failure behavior at the host seam.

The process uses standard Node lifecycle and signal interfaces, so a future Windows Service host
can start the launcher and request termination without coupling the runtime to a specific service
wrapper. MM-011 will select packaging, installation, upgrades, and service registration.

## Configuration

| Variable                         | Purpose                             | Default               |
| -------------------------------- | ----------------------------------- | --------------------- |
| `DATABASE_URL`                   | PostgreSQL connection string        | required              |
| `DATABASE_POOL_MAX`              | Maximum connections                 | MM-004 default        |
| `DATABASE_CONNECTION_TIMEOUT_MS` | Connection timeout                  | MM-004 default        |
| `DATABASE_IDLE_TIMEOUT_MS`       | Idle connection timeout             | MM-004 default        |
| `DATABASE_STATEMENT_TIMEOUT_MS`  | Statement timeout                   | MM-004 default        |
| `MINIMART_SERVICE_NAME`          | Structured service identity         | `minimart-store-node` |
| `MINIMART_APPLICATION_BUILD`     | Build used for schema compatibility | `0.0.0`               |
| `MINIMART_SHUTDOWN_TIMEOUT_MS`   | Resource cleanup bound              | `10000`               |

Logs use an allow-listed structured shape and never include configuration or database connection
strings.

## Test strategy

Focused tests inject a fake database boundary and cover successful startup, unavailable database,
incompatible schema, unexpected startup failure cleanup, graceful shutdown, repeated shutdown,
explicit lifecycle transitions, invalid transitions, configuration validation, and Windows or
console signal registration. MM-004 retains its PostgreSQL integration tests as the executable
proof of the consumed readiness implementation.

## Deferred work

- POS shell and Store Node connectivity
- Store Node HTTP and retail APIs
- synchronization
- hardware integration
- installer, Windows Service registration, and upgrades
- business modules and workflows
