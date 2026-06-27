/**
 * Thin logging seam so application code doesn't call `console.*` directly.
 *
 * Today this writes to the console; swap the implementation here for Sentry /
 * Datadog / a structured logger before production WITHOUT touching call sites.
 * `captureException` is the hook a monitoring SDK plugs into.
 */

type Meta = Record<string, unknown>;

function emit(level: "info" | "warn" | "error", scope: string, message: string, meta?: Meta) {
  const line = `[${scope}] ${message}`;
  if (level === "error") console.error(line, meta ?? "");
  else if (level === "warn") console.warn(line, meta ?? "");
  else console.info(line, meta ?? "");
}

export const logger = {
  info: (scope: string, message: string, meta?: Meta) => emit("info", scope, message, meta),
  warn: (scope: string, message: string, meta?: Meta) => emit("warn", scope, message, meta),
  error: (scope: string, message: string, meta?: Meta) => emit("error", scope, message, meta),

  /**
   * Report an unexpected error to monitoring. Wire this to your error-tracking
   * SDK (e.g. Sentry.captureException) — for now it logs.
   */
  captureException: (scope: string, error: unknown, meta?: Meta) => {
    emit("error", scope, error instanceof Error ? error.message : String(error), {
      ...meta,
      stack: error instanceof Error ? error.stack : undefined,
    });
  },
};
