import { describe, expect, it } from "vitest";
import { createRateLimiter } from "@/features/auth/rate-limit";

describe("createRateLimiter", () => {
  it("allows up to `max` attempts then blocks", () => {
    const rl = createRateLimiter({ max: 3, windowMs: 1000, now: () => 0 });
    expect(rl.check("k").allowed).toBe(true);
    expect(rl.check("k").allowed).toBe(true);
    expect(rl.check("k").allowed).toBe(true);
    expect(rl.check("k").allowed).toBe(false);
  });

  it("reports remaining attempts and retryAfter", () => {
    const rl = createRateLimiter({ max: 2, windowMs: 1000, now: () => 0 });
    expect(rl.check("k").remaining).toBe(1);
    expect(rl.check("k").remaining).toBe(0);
    const blocked = rl.check("k");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBe(1000);
  });

  it("tracks keys independently", () => {
    const rl = createRateLimiter({ max: 1, windowMs: 1000, now: () => 0 });
    expect(rl.check("a").allowed).toBe(true);
    expect(rl.check("a").allowed).toBe(false);
    expect(rl.check("b").allowed).toBe(true); // different key unaffected
  });

  it("frees the window once old attempts age out (sliding window)", () => {
    let t = 0;
    const rl = createRateLimiter({ max: 1, windowMs: 1000, now: () => t });
    expect(rl.check("k").allowed).toBe(true);
    expect(rl.check("k").allowed).toBe(false);
    t = 1001; // first attempt is now older than the window
    expect(rl.check("k").allowed).toBe(true);
  });

  it("does not extend its own lockout while blocked", () => {
    let t = 0;
    const rl = createRateLimiter({ max: 1, windowMs: 1000, now: () => t });
    expect(rl.check("k").allowed).toBe(true); // recorded at t=0
    t = 500;
    expect(rl.check("k").allowed).toBe(false); // blocked, NOT recorded
    t = 1001; // only the t=0 attempt counts, so it has expired
    expect(rl.check("k").allowed).toBe(true);
  });

  it("reset() clears a single key", () => {
    const rl = createRateLimiter({ max: 1, windowMs: 1000, now: () => 0 });
    rl.check("k");
    expect(rl.check("k").allowed).toBe(false);
    rl.reset("k");
    expect(rl.check("k").allowed).toBe(true);
  });

  it("clear() wipes all keys", () => {
    const rl = createRateLimiter({ max: 1, windowMs: 1000, now: () => 0 });
    rl.check("a");
    rl.check("b");
    rl.clear();
    expect(rl.check("a").allowed).toBe(true);
    expect(rl.check("b").allowed).toBe(true);
  });
});
