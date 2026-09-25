export type LogLevel = "info" | "error";

export interface RuntimeLogEntry {
  readonly timestamp: string;
  readonly level: LogLevel;
  readonly event: string;
  readonly service: string;
  readonly state?: string;
  readonly message?: string;
  readonly reasons?: readonly string[];
  readonly signal?: string;
  readonly transactionalReady?: boolean;
  readonly databaseReady?: boolean;
  readonly schemaCompatible?: boolean;
}

export interface RuntimeLogger {
  write(entry: RuntimeLogEntry): void;
}

export function createConsoleRuntimeLogger(): RuntimeLogger {
  return {
    write(entry): void {
      const output = JSON.stringify(entry);
      if (entry.level === "error") console.error(output);
      else console.log(output);
    },
  };
}
