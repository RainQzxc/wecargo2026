"use server";

import { captureException } from "@/lib/observability";

/**
 * Bridge so client error boundaries (error.tsx / global-error.tsx) can forward
 * an error to server-side Axiom ingest without exposing the token to the
 * browser. Best-effort; never throws.
 */
export async function reportClientError(input: {
  message: string;
  stack?: string;
  digest?: string;
  source?: string;
  route?: string;
}): Promise<void> {
  const err = new Error(input.message);
  if (input.stack) err.stack = input.stack;
  await captureException(err, {
    source: input.source ?? "error-boundary",
    digest: input.digest,
    route: input.route,
  });
}
