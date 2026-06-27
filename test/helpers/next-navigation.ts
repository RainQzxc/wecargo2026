import { vi } from "vitest";

/**
 * Next's `redirect()` / `forbidden()` work by THROWING a control-flow signal
 * rather than returning, so server actions rely on them to halt execution.
 * These helpers reproduce that: the mocks throw a tagged Error that tests can
 * recognize, so we can assert "the action redirected to X" or "the action
 * 403'd" without pulling in the real next/navigation runtime.
 */

export class RedirectError extends Error {
  constructor(public url: string) {
    super(`NEXT_REDIRECT:${url}`);
    this.name = "RedirectError";
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("NEXT_FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export const redirect = vi.fn((url: string): never => {
  throw new RedirectError(url);
});

export const forbidden = vi.fn((): never => {
  throw new ForbiddenError();
});

/** Run an action that is expected to redirect, and return the target URL. */
export async function captureRedirect(fn: () => Promise<unknown>): Promise<string> {
  try {
    await fn();
  } catch (err) {
    if (err instanceof RedirectError) return err.url;
    throw err;
  }
  throw new Error("Expected the action to redirect, but it returned normally.");
}
