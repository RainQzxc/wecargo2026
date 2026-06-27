import { beforeAll, describe, expect, it } from "vitest";
import {
  decodeSession,
  encodeSession,
  type SessionPayload,
} from "@/features/auth/session";
import { ROLES } from "@/constants/roles";

// Pin the signing secret so tokens are deterministic across this run.
beforeAll(() => {
  process.env.SESSION_SECRET = "test-secret";
});

function future(): number {
  return Date.now() + 60_000;
}

describe("encodeSession / decodeSession round-trip", () => {
  it("decodes a freshly encoded payload", () => {
    const payload: SessionPayload = {
      userId: "user-1",
      role: ROLES.ADMIN,
      exp: future(),
    };
    const token = encodeSession(payload);
    expect(decodeSession(token)).toEqual(payload);
  });

  it("produces a two-part body.signature token", () => {
    const token = encodeSession({ userId: "u", role: ROLES.CUSTOMER, exp: future() });
    expect(token.split(".")).toHaveLength(2);
  });
});

describe("decodeSession rejects invalid tokens", () => {
  it("returns null for null/undefined/empty", () => {
    expect(decodeSession(null)).toBeNull();
    expect(decodeSession(undefined)).toBeNull();
    expect(decodeSession("")).toBeNull();
  });

  it("returns null when there is no signature separator", () => {
    expect(decodeSession("no-dot-here")).toBeNull();
  });

  it("returns null when the dot is at the start (empty body)", () => {
    expect(decodeSession(".somesig")).toBeNull();
  });

  it("returns null for a tampered body (signature mismatch)", () => {
    const token = encodeSession({ userId: "u", role: ROLES.ADMIN, exp: future() });
    const [, sig] = token.split(".");
    const forgedBody = Buffer.from(
      JSON.stringify({ userId: "attacker", role: ROLES.SUPER_ADMIN, exp: future() }),
    ).toString("base64url");
    expect(decodeSession(`${forgedBody}.${sig}`)).toBeNull();
  });

  it("returns null for a tampered signature", () => {
    const token = encodeSession({ userId: "u", role: ROLES.ADMIN, exp: future() });
    const [body] = token.split(".");
    expect(decodeSession(`${body}.deadbeef`)).toBeNull();
  });

  it("returns null when the token was signed with a different secret", () => {
    const token = encodeSession({ userId: "u", role: ROLES.ADMIN, exp: future() });
    process.env.SESSION_SECRET = "rotated-secret";
    expect(decodeSession(token)).toBeNull();
    process.env.SESSION_SECRET = "test-secret"; // restore for other tests
  });

  it("returns null for an expired token", () => {
    const token = encodeSession({
      userId: "u",
      role: ROLES.ADMIN,
      exp: Date.now() - 1_000,
    });
    expect(decodeSession(token)).toBeNull();
  });
});
