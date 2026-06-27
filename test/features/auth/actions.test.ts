import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { captureRedirect, redirect } from "../../helpers/next-navigation";

// ---- Mocks ----------------------------------------------------------------
// `vi.hoisted` lets these mocks exist before the hoisted `vi.mock` factories run.
// Mock the DB so no Prisma client / Postgres connection is needed. `audit.ts`
// imports the same `db`, so its writes land on these spies too. Session writes
// touch cookies(), so those are stubbed as well.
const { dbMock, createSession, destroySession } = vi.hoisted(() => ({
  dbMock: {
    user: { findFirst: vi.fn(), update: vi.fn() },
    auditLog: { create: vi.fn() },
  },
  createSession: vi.fn(),
  destroySession: vi.fn(),
}));
vi.mock("@/server/db", () => ({ db: dbMock }));
vi.mock("@/features/auth/session", () => ({ createSession, destroySession }));

vi.mock("next/navigation", () => ({ redirect, forbidden: vi.fn() }));

import { login } from "@/features/auth/actions";
import { hashPassword } from "@/features/auth/password";
import { AUDIT_ACTIONS } from "@/constants/audit-actions";
import { ROUTES } from "@/constants/routes";
import { ROLES } from "@/constants/roles";

function formData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const PASSWORD = "correct-password";

beforeEach(() => {
  dbMock.user.update.mockResolvedValue({});
  dbMock.auditLog.create.mockResolvedValue({});
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("login — input validation", () => {
  it("returns an error when identifier is missing, without hitting the DB", async () => {
    const res = await login({}, formData({ password: PASSWORD }));
    expect(res.error).toBeTruthy();
    expect(dbMock.user.findFirst).not.toHaveBeenCalled();
  });

  it("returns an error when password is missing", async () => {
    const res = await login({}, formData({ identifier: "a@b.com" }));
    expect(res.error).toBeTruthy();
    expect(dbMock.user.findFirst).not.toHaveBeenCalled();
  });
});

describe("login — bad credentials", () => {
  it("returns a generic error and audits the failure when the user is unknown", async () => {
    dbMock.user.findFirst.mockResolvedValue(null);

    const res = await login({}, formData({ identifier: "ghost@x.com", password: "x" }));

    expect(res.error).toBeTruthy();
    expect(createSession).not.toHaveBeenCalled();
    expect(dbMock.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ action: AUDIT_ACTIONS.AUTH_LOGIN_FAILED }),
      }),
    );
  });

  it("returns an error when the password does not match", async () => {
    dbMock.user.findFirst.mockResolvedValue({
      id: "u1",
      role: ROLES.ADMIN,
      status: "ACTIVE",
      passwordHash: hashPassword(PASSWORD),
    });

    const res = await login({}, formData({ identifier: "a@b.com", password: "WRONG" }));

    expect(res.error).toBeTruthy();
    expect(createSession).not.toHaveBeenCalled();
  });
});

describe("login — disabled account", () => {
  it("refuses a disabled user even with the right password", async () => {
    dbMock.user.findFirst.mockResolvedValue({
      id: "u2",
      role: ROLES.ADMIN,
      status: "DISABLED",
      passwordHash: hashPassword(PASSWORD),
    });

    const res = await login({}, formData({ identifier: "a@b.com", password: PASSWORD }));

    expect(res.error).toBeTruthy();
    expect(createSession).not.toHaveBeenCalled();
  });
});

describe("login — success", () => {
  it("creates a session and redirects to the dashboard", async () => {
    dbMock.user.findFirst.mockResolvedValue({
      id: "u3",
      role: ROLES.SUPER_ADMIN,
      status: "ACTIVE",
      passwordHash: hashPassword(PASSWORD),
    });

    const target = await captureRedirect(() =>
      login({}, formData({ identifier: "boss@x.com", password: PASSWORD })),
    );

    expect(createSession).toHaveBeenCalledWith("u3", ROLES.SUPER_ADMIN);
    expect(target).toBe(ROUTES.dashboard.root);
  });

  it("matches a user by normalized phone too", async () => {
    dbMock.user.findFirst.mockResolvedValue({
      id: "u4",
      role: ROLES.CUSTOMER,
      status: "ACTIVE",
      passwordHash: hashPassword(PASSWORD),
    });

    await captureRedirect(() =>
      login({}, formData({ identifier: " 9911-2233 ", password: PASSWORD })),
    );

    // The OR lookup should receive the normalized phone (spaces/dashes removed).
    const where = dbMock.user.findFirst.mock.calls[0][0].where;
    expect(where.OR).toContainEqual({ phoneNormalized: "99112233" });
  });

  it("returns a system error if the DB lookup throws", async () => {
    dbMock.user.findFirst.mockRejectedValue(new Error("db down"));

    const res = await login({}, formData({ identifier: "a@b.com", password: PASSWORD }));

    expect(res.error).toBeTruthy();
    expect(createSession).not.toHaveBeenCalled();
  });
});
