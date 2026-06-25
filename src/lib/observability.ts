import "server-only";

/**
 * Lightweight error/event tracking via Axiom's HTTP ingest API. No SDK
 * dependency (keeps us off fragile framework integrations on this Next
 * version). No-ops when AXIOM_TOKEN / AXIOM_DATASET are unset, so local dev and
 * preview builds don't fail.
 *
 * Set AXIOM_TOKEN (API token with ingest rights) and AXIOM_DATASET in the env.
 */

const AXIOM_INGEST = "https://api.axiom.co/v1/datasets";

function enabled(): boolean {
  return Boolean(process.env.AXIOM_TOKEN && process.env.AXIOM_DATASET);
}

type Json = Record<string, unknown>;

async function ingest(event: Json): Promise<void> {
  if (!enabled()) return;
  const dataset = process.env.AXIOM_DATASET!;
  try {
    await fetch(`${AXIOM_INGEST}/${dataset}/ingest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AXIOM_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ _time: new Date().toISOString(), ...event }]),
      // Don't let telemetry hang a request.
      signal: AbortSignal.timeout(3000),
    });
  } catch (err) {
    // Never throw from telemetry.
    console.error("[observability] ingest failed:", err);
  }
}

export interface ErrorContext {
  source?: string; // e.g. "server-action", "error-boundary", "global-error"
  digest?: string;
  route?: string;
  userId?: string;
  [key: string]: unknown;
}

/** Report a caught error. Safe to await or fire-and-forget. */
export async function captureException(error: unknown, context: ErrorContext = {}): Promise<void> {
  const e = error instanceof Error ? error : new Error(String(error));
  console.error(`[error]${context.source ? ` [${context.source}]` : ""}`, e);
  await ingest({
    level: "error",
    message: e.message,
    name: e.name,
    stack: e.stack,
    ...context,
  });
}

/** Report an arbitrary structured event/log line. */
export async function logEvent(message: string, fields: Json = {}): Promise<void> {
  await ingest({ level: "info", message, ...fields });
}
