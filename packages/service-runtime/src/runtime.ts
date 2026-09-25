import {
  assessDatabaseReadiness,
  createDatabasePool,
  type DatabaseReadiness,
} from "@minimart/database";

import type { ServiceConfiguration } from "./config.js";
import { ServiceLifecycle, type ServiceState } from "./lifecycle.js";
import type { RuntimeLogger } from "./logging.js";

export interface LivenessResult {
  readonly status: "UP";
  readonly time: string;
}

export interface ServiceReadinessResult {
  readonly status: ServiceState;
  readonly transactionalReady: boolean;
  readonly databaseReady: boolean;
  readonly schemaCompatible: boolean;
  readonly reasons: readonly string[];
}

export interface RuntimeDatabase {
  assessReadiness(applicationBuild: string): Promise<DatabaseReadiness>;
  close(): Promise<void>;
}

export type RuntimeDatabaseFactory = (configuration: ServiceConfiguration) => RuntimeDatabase;

export interface StoreServiceRuntimeOptions {
  readonly configuration: ServiceConfiguration;
  readonly logger: RuntimeLogger;
  readonly databaseFactory?: RuntimeDatabaseFactory;
  readonly now?: () => Date;
}

export class ServiceStartupError extends Error {
  constructor(
    message: string,
    readonly readiness: ServiceReadinessResult,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "ServiceStartupError";
  }
}

function databaseAdapter(configuration: ServiceConfiguration): RuntimeDatabase {
  const pool = createDatabasePool(configuration.database);
  return {
    assessReadiness(applicationBuild): Promise<DatabaseReadiness> {
      return assessDatabaseReadiness(pool, { applicationBuild });
    },
    close(): Promise<void> {
      return pool.end();
    },
  };
}

async function bounded(operation: Promise<void>, milliseconds: number): Promise<void> {
  let timeout: NodeJS.Timeout | undefined;
  try {
    await Promise.race([
      operation,
      new Promise<never>((_resolve, reject) => {
        timeout = setTimeout(
          () => reject(new Error(`Shutdown exceeded ${milliseconds}ms`)),
          milliseconds,
        );
        timeout.unref();
      }),
    ]);
  } finally {
    if (timeout !== undefined) clearTimeout(timeout);
  }
}

export class StoreServiceRuntime {
  readonly #configuration: ServiceConfiguration;
  readonly #logger: RuntimeLogger;
  readonly #databaseFactory: RuntimeDatabaseFactory;
  readonly #now: () => Date;
  readonly #lifecycle = new ServiceLifecycle();
  #database: RuntimeDatabase | undefined;
  #databaseReadiness: DatabaseReadiness | undefined;
  #stopPromise: Promise<void> | undefined;
  #refreshPromise: Promise<ServiceReadinessResult> | undefined;
  #databaseAssessment: Promise<DatabaseReadiness> | undefined;
  #databaseAssessmentTimedOut = false;

  constructor(options: StoreServiceRuntimeOptions) {
    this.#configuration = options.configuration;
    this.#logger = options.logger;
    this.#databaseFactory = options.databaseFactory ?? databaseAdapter;
    this.#now = options.now ?? (() => new Date());
  }

  get state(): ServiceState {
    return this.#lifecycle.state;
  }

  liveness(): LivenessResult {
    return { status: "UP", time: this.#now().toISOString() };
  }

  readiness(): ServiceReadinessResult {
    const databaseReady = this.#databaseReadiness?.health.healthy === true;
    const schemaCompatible = databaseReady && this.#databaseReadiness?.readyForWrites === true;
    const transactionalReady =
      this.state === "RUNNING" && this.#databaseReadiness?.readyForWrites === true;
    const reasons = transactionalReady
      ? []
      : (this.#databaseReadiness?.reasons ?? [`SERVICE_${this.state}`]);

    return {
      status: this.state,
      transactionalReady,
      databaseReady,
      schemaCompatible,
      reasons,
    };
  }

  refreshReadiness(): Promise<ServiceReadinessResult> {
    if (this.#refreshPromise !== undefined) return this.#refreshPromise;
    const operation = this.#refreshReadiness();
    this.#refreshPromise = operation;
    void operation.then(
      () => {
        if (this.#refreshPromise === operation) this.#refreshPromise = undefined;
      },
      () => {
        if (this.#refreshPromise === operation) this.#refreshPromise = undefined;
      },
    );
    return operation;
  }

  async #refreshReadiness(): Promise<ServiceReadinessResult> {
    if (this.state !== "RUNNING" && this.state !== "DEGRADED") return this.readiness();
    const database = this.#database;
    if (database === undefined) return this.readiness();
    let assessed: DatabaseReadiness;
    try {
      if (this.#databaseAssessmentTimedOut && this.#databaseAssessment !== undefined) {
        throw new Error("Previous readiness assessment is still pending");
      }
      const assessment = database.assessReadiness(this.#configuration.applicationBuild);
      this.#databaseAssessment = assessment;
      void assessment.then(
        () => {
          if (this.#databaseAssessment === assessment) {
            this.#databaseAssessment = undefined;
            this.#databaseAssessmentTimedOut = false;
          }
        },
        () => {
          if (this.#databaseAssessment === assessment) {
            this.#databaseAssessment = undefined;
            this.#databaseAssessmentTimedOut = false;
          }
        },
      );
      const timeoutMilliseconds = Math.min(
        this.#configuration.database.connectionTimeoutMilliseconds,
        2_500,
      );
      let timeout: NodeJS.Timeout | undefined;
      try {
        assessed = await Promise.race([
          assessment,
          new Promise<never>((_resolve, reject) => {
            timeout = setTimeout(() => {
              this.#databaseAssessmentTimedOut = true;
              reject(new Error("Readiness assessment timed out"));
            }, timeoutMilliseconds);
            timeout.unref();
          }),
        ]);
      } finally {
        if (timeout !== undefined) clearTimeout(timeout);
      }
    } catch {
      assessed = {
        readyForWrites: false,
        health: { healthy: false, latencyMilliseconds: 0, reason: "ReadinessAssessmentError" },
        schemaVersion: null,
        reasons: ["DATABASE_UNHEALTHY"],
      };
    }
    this.#databaseReadiness = assessed;
    if (this.state === "RUNNING" && !assessed.readyForWrites) {
      this.#lifecycle.transition("DEGRADED");
      this.#log("info", "service.degraded", undefined, assessed.reasons);
    } else if (this.state === "DEGRADED" && assessed.readyForWrites) {
      this.#lifecycle.transition("RUNNING");
      this.#log("info", "service.recovered");
    }
    return this.readiness();
  }

  async start(): Promise<ServiceReadinessResult> {
    this.#lifecycle.transition("STARTING");
    this.#stopPromise = undefined;
    this.#log("info", "service.starting");
    try {
      this.#database = this.#databaseFactory(this.#configuration);
      this.#databaseReadiness = await this.#database.assessReadiness(
        this.#configuration.applicationBuild,
      );
      this.#log("info", "database.readiness", undefined, this.#databaseReadiness.reasons);
      if (!this.#databaseReadiness.readyForWrites) {
        throw new Error("Database is not transactionally ready");
      }
      this.#lifecycle.transition("RUNNING");
      this.#log("info", "service.running", undefined, undefined, this.readiness());
      return this.readiness();
    } catch (cause) {
      if (this.state === "STARTING") this.#lifecycle.transition("FAILED");
      const cleanupError = await this.#closeDatabase();
      const message = cleanupError
        ? "Store Node startup failed and database cleanup failed"
        : "Store Node startup failed";
      this.#log("error", "service.startup_failed", message, this.readiness().reasons);
      throw new ServiceStartupError(message, this.readiness(), { cause });
    }
  }

  stop(): Promise<void> {
    if (this.#stopPromise !== undefined) return this.#stopPromise;
    if (this.state === "STOPPED") return Promise.resolve();
    this.#stopPromise = this.#performStop();
    return this.#stopPromise;
  }

  async #performStop(): Promise<void> {
    if (this.state !== "STOPPING") this.#lifecycle.transition("STOPPING");
    this.#log("info", "service.stopping");
    try {
      const closeError = await this.#closeDatabase(true);
      if (closeError !== undefined) throw closeError;
      this.#lifecycle.transition("STOPPED");
      this.#log("info", "service.stopped");
    } catch (cause) {
      this.#lifecycle.transition("FAILED");
      this.#log("error", "service.shutdown_failed", "Store Node shutdown failed");
      throw cause;
    }
  }

  async #closeDatabase(useTimeout = false): Promise<unknown | undefined> {
    const database = this.#database;
    this.#database = undefined;
    if (database === undefined) return undefined;
    try {
      const close = database.close();
      if (useTimeout) await bounded(close, this.#configuration.shutdownTimeoutMilliseconds);
      else await close;
      return undefined;
    } catch (error) {
      return error;
    }
  }

  #log(
    level: "info" | "error",
    event: string,
    message?: string,
    reasons?: readonly string[],
    readiness?: ServiceReadinessResult,
  ): void {
    this.#logger.write({
      timestamp: this.#now().toISOString(),
      level,
      event,
      service: this.#configuration.serviceName,
      state: this.state,
      ...(message === undefined ? {} : { message }),
      ...(reasons === undefined ? {} : { reasons }),
      ...(readiness === undefined
        ? {}
        : {
            transactionalReady: readiness.transactionalReady,
            databaseReady: readiness.databaseReady,
            schemaCompatible: readiness.schemaCompatible,
          }),
    });
  }
}
