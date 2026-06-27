import "server-only";

/**
 * Minimal in-memory sliding-window rate limiter for brute-force defense on
 * sensitive endpoints (login). It is intentionally dependency-free.
 *
 * Caveat: state lives in process memory, so in a multi-instance / serverless
 * deployment each instance limits independently. That still raises the cost of
 * a brute-force attack meaningfully, but for strict guarantees back this with a
 * shared store (Redis, or a DB table) before relying on it as the only control.
 */

export interface RateLimitResult {
  /** Whether this attempt is permitted. */
  allowed: boolean;
  /** Attempts remaining in the current window (0 when blocked). */
  remaining: number;
  /** Milliseconds until the window frees up (0 when allowed). */
  retryAfterMs: number;
}

export interface RateLimiterOptions {
  /** Max attempts permitted within `windowMs`. */
  max: number;
  /** Sliding-window length in milliseconds. */
  windowMs: number;
  /** Injectable clock — override in tests for deterministic windows. */
  now?: () => number;
}

export interface RateLimiter {
  /** Record an attempt for `key` and report whether it is allowed. */
  check(key: string): RateLimitResult;
  /** Forget `key` entirely (e.g. after a successful login). */
  reset(key: string): void;
  /** Forget every key. */
  clear(): void;
}

export function createRateLimiter({ max, windowMs, now = Date.now }: RateLimiterOptions): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    check(key: string): RateLimitResult {
      const t = now();
      const cutoff = t - windowMs;
      const recent = (hits.get(key) ?? []).filter((ts) => ts > cutoff);

      if (recent.length >= max) {
        // Blocked: do NOT record this attempt, so a persistent attacker cannot
        // keep extending their own lockout indefinitely — the window expires.
        hits.set(key, recent);
        return { allowed: false, remaining: 0, retryAfterMs: recent[0] + windowMs - t };
      }

      recent.push(t);
      hits.set(key, recent);
      return { allowed: true, remaining: max - recent.length, retryAfterMs: 0 };
    },
    reset(key: string): void {
      hits.delete(key);
    },
    clear(): void {
      hits.clear();
    },
  };
}

/**
 * Shared limiter for the login action: 5 attempts per 15 minutes per
 * identifier. Exported so an admin "unlock" flow (or tests) can reset a key.
 */
export const loginRateLimiter = createRateLimiter({
  max: 5,
  windowMs: 15 * 60 * 1000,
});
