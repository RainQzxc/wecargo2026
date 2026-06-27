import { describe, expect, it } from "vitest";
import {
  ALL_PERMISSIONS,
  PERMISSIONS,
  getPermissionsForRole,
  roleHasAllPermissions,
  roleHasAnyPermission,
  roleHasPermission,
} from "@/features/auth/permissions";
import { ROLES } from "@/constants/roles";

describe("getPermissionsForRole", () => {
  it("grants SUPER_ADMIN every permission", () => {
    expect(getPermissionsForRole(ROLES.SUPER_ADMIN)).toEqual(ALL_PERMISSIONS);
  });

  it("grants ADMIN a non-empty subset smaller than the full set", () => {
    const admin = getPermissionsForRole(ROLES.ADMIN);
    expect(admin.length).toBeGreaterThan(0);
    expect(admin.length).toBeLessThan(ALL_PERMISSIONS.length);
  });

  it("grants no admin-dashboard permissions to operational roles", () => {
    expect(getPermissionsForRole(ROLES.WAREHOUSE_STAFF)).toEqual([]);
    expect(getPermissionsForRole(ROLES.CUSTOMER)).toEqual([]);
    expect(getPermissionsForRole(ROLES.COURIER)).toEqual([]);
  });
});

describe("roleHasPermission", () => {
  it("lets ADMIN handle daily parcel operations", () => {
    expect(roleHasPermission(ROLES.ADMIN, PERMISSIONS.PARCELS_CREATE)).toBe(true);
    expect(roleHasPermission(ROLES.ADMIN, PERMISSIONS.PARCELS_UPDATE_STATUS)).toBe(true);
    expect(roleHasPermission(ROLES.ADMIN, PERMISSIONS.DELIVERIES_ASSIGN)).toBe(true);
  });

  // The security boundary the permissions module documents but does not
  // otherwise enforce: ADMIN must never reach dangerous system controls.
  it.each([
    ["change roles", PERMISSIONS.USERS_CHANGE_ROLE],
    ["edit tariffs", PERMISSIONS.TARIFFS_UPDATE],
    ["delete tariffs", PERMISSIONS.TARIFFS_DELETE],
    ["read audit logs", PERMISSIONS.AUDIT_LOGS_READ],
    ["update settings", PERMISSIONS.SETTINGS_UPDATE],
    ["view financial reports", PERMISSIONS.REPORTS_FINANCIAL],
    ["reopen batches", PERMISSIONS.BATCHES_REOPEN],
    ["cancel batches", PERMISSIONS.BATCHES_CANCEL],
    ["override ownership claims", PERMISSIONS.OWNERSHIP_CLAIMS_OVERRIDE],
    ["hard-delete parcels", PERMISSIONS.PARCELS_HARD_DELETE],
    ["delete customers", PERMISSIONS.CUSTOMERS_DELETE],
  ])("denies ADMIN the ability to %s", (_label, permission) => {
    expect(roleHasPermission(ROLES.ADMIN, permission)).toBe(false);
  });

  it("grants SUPER_ADMIN those same dangerous controls", () => {
    expect(roleHasPermission(ROLES.SUPER_ADMIN, PERMISSIONS.USERS_CHANGE_ROLE)).toBe(true);
    expect(roleHasPermission(ROLES.SUPER_ADMIN, PERMISSIONS.AUDIT_LOGS_READ)).toBe(true);
    expect(roleHasPermission(ROLES.SUPER_ADMIN, PERMISSIONS.SETTINGS_UPDATE)).toBe(true);
  });

  it("denies any permission to a role with an empty grant set", () => {
    expect(roleHasPermission(ROLES.CUSTOMER, PERMISSIONS.PARCELS_READ)).toBe(false);
  });
});

describe("roleHasAnyPermission", () => {
  it("is true when at least one permission is held", () => {
    expect(
      roleHasAnyPermission(ROLES.ADMIN, [
        PERMISSIONS.SETTINGS_UPDATE, // denied
        PERMISSIONS.PARCELS_READ, // granted
      ]),
    ).toBe(true);
  });

  it("is false when none are held", () => {
    expect(
      roleHasAnyPermission(ROLES.ADMIN, [
        PERMISSIONS.SETTINGS_UPDATE,
        PERMISSIONS.AUDIT_LOGS_READ,
      ]),
    ).toBe(false);
  });

  it("is false for an empty permission list", () => {
    expect(roleHasAnyPermission(ROLES.SUPER_ADMIN, [])).toBe(false);
  });
});

describe("roleHasAllPermissions", () => {
  it("is true only when every permission is held", () => {
    expect(
      roleHasAllPermissions(ROLES.ADMIN, [
        PERMISSIONS.PARCELS_READ,
        PERMISSIONS.PARCELS_CREATE,
      ]),
    ).toBe(true);
  });

  it("is false when any one permission is missing", () => {
    expect(
      roleHasAllPermissions(ROLES.ADMIN, [
        PERMISSIONS.PARCELS_READ,
        PERMISSIONS.SETTINGS_UPDATE, // denied
      ]),
    ).toBe(false);
  });

  it("is vacuously true for an empty permission list", () => {
    expect(roleHasAllPermissions(ROLES.CUSTOMER, [])).toBe(true);
  });
});
