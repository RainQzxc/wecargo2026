import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ForbiddenError,
  RedirectError,
  forbidden,
  redirect,
} from "../../helpers/next-navigation";

// ---- Mocks ----------------------------------------------------------------
const { dbMock, readSession } = vi.hoisted(() => ({
  dbMock: { user: { findUnique: vi.fn() } },
  readSession: vi.fn(),
}));
vi.mock("@/server/db", () => ({ db: dbMock }));
vi.mock("@/features/auth/session", () => ({ readSession }));
vi.mock("next/navigation", () => ({ redirect, forbidden }));

// React's `cache()` memoizes per-request; make it a pass-through so each test
// re-evaluates getCurrentUser against fresh mock state.
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return { ...actual, cache: <T,>(fn: T): T => fn };
});

import {
  can,
  getCurrentUser,
  requireAllPermissions,
  requireAnyPermission,
  requireAuth,
  requirePermission,
  requireRole,
} from "@/features/auth/dal";
import { PERMISSIONS } from "@/features/auth/permissions";
import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

function sessionFor(role = ROLES.ADMIN) {
  readSession.mockResolvedValue({ userId: "u1", role, exp: Date.now() + 1000 });
}
function dbUser(overrides: Record<string, unknown> = {}) {
  dbMock.user.findUnique.mockResolvedValue({
    id: "u1",
    role: ROLES.ADMIN,
    status: "ACTIVE",
    name: "Bat",
    email: "bat@x.com",
    phone: null,
    ...overrides,
  });
}

beforeEach(() => {
  sessionFor();
  dbUser();
});
afterEach(() => {
  vi.clearAllMocks();
});

describe("getCurrentUser", () => {
  it("returns null when there is no session", async () => {
    readSession.mockResolvedValue(null);
    expect(await getCurrentUser()).toBeNull();
    expect(dbMock.user.findUnique).not.toHaveBeenCalled();
  });

  it("returns null for a DISABLED user (cookie cannot override DB status)", async () => {
    dbUser({ status: "DISABLED" });
    expect(await getCurrentUser()).toBeNull();
  });

  it("returns null when the user no longer exists", async () => {
    dbMock.user.findUnique.mockResolvedValue(null);
    expect(await getCurrentUser()).toBeNull();
  });

  it("returns the user on the happy path", async () => {
    const user = await getCurrentUser();
    expect(user).toMatchObject({ id: "u1", role: ROLES.ADMIN, status: "ACTIVE" });
  });

  it("swallows DB errors and returns null", async () => {
    dbMock.user.findUnique.mockRejectedValue(new Error("db down"));
    expect(await getCurrentUser()).toBeNull();
  });
});

describe("requireAuth", () => {
  it("redirects to login when unauthenticated", async () => {
    readSession.mockResolvedValue(null);
    await expect(requireAuth()).rejects.toBeInstanceOf(RedirectError);
    expect(redirect).toHaveBeenCalledWith(ROUTES.login);
  });

  it("returns the user when authenticated", async () => {
    await expect(requireAuth()).resolves.toMatchObject({ id: "u1" });
  });
});

describe("requireRole", () => {
  it("403s when the role is not allowed", async () => {
    sessionFor(ROLES.ADMIN);
    dbUser({ role: ROLES.ADMIN });
    await expect(requireRole(ROLES.SUPER_ADMIN)).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("passes when the role is allowed", async () => {
    await expect(requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN)).resolves.toMatchObject({
      id: "u1",
    });
  });
});

describe("requirePermission", () => {
  it("403s when the user lacks the permission", async () => {
    dbUser({ role: ROLES.ADMIN }); // ADMIN cannot update settings
    await expect(requirePermission(PERMISSIONS.SETTINGS_UPDATE)).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });

  it("passes when the user holds the permission", async () => {
    await expect(requirePermission(PERMISSIONS.PARCELS_READ)).resolves.toMatchObject({
      id: "u1",
    });
  });
});

describe("requireAnyPermission / requireAllPermissions", () => {
  it("requireAnyPermission passes if at least one is held", async () => {
    await expect(
      requireAnyPermission([PERMISSIONS.SETTINGS_UPDATE, PERMISSIONS.PARCELS_READ]),
    ).resolves.toMatchObject({ id: "u1" });
  });

  it("requireAnyPermission 403s if none are held", async () => {
    await expect(
      requireAnyPermission([PERMISSIONS.SETTINGS_UPDATE, PERMISSIONS.AUDIT_LOGS_READ]),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("requireAllPermissions 403s if any one is missing", async () => {
    await expect(
      requireAllPermissions([PERMISSIONS.PARCELS_READ, PERMISSIONS.SETTINGS_UPDATE]),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe("can", () => {
  it("returns true/false without throwing", async () => {
    expect(await can(PERMISSIONS.PARCELS_READ)).toBe(true);
    expect(await can(PERMISSIONS.SETTINGS_UPDATE)).toBe(false);
  });

  it("returns false when unauthenticated", async () => {
    readSession.mockResolvedValue(null);
    expect(await can(PERMISSIONS.PARCELS_READ)).toBe(false);
  });
});
