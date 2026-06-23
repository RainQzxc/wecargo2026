import { ROLES, type Role } from "@/constants/roles";

/**
 * Central permission catalog for WECARGO dashboards.
 *
 * Permissions are the unit of authorization. Roles are mapped to a set of
 * permissions in {@link ROLE_PERMISSIONS}. ALWAYS enforce permissions on the
 * server (server actions / route handlers / page guards) — UI hiding alone is
 * never sufficient. See `src/features/auth/dal.ts`.
 */
export const PERMISSIONS = {
  // Users & Staff
  USERS_READ: "users.read",
  USERS_CREATE: "users.create",
  USERS_UPDATE: "users.update",
  USERS_DISABLE: "users.disable",
  USERS_CHANGE_ROLE: "users.changeRole",
  USERS_RESET_PASSWORD: "users.resetPassword",
  USERS_ASSIGN_WAREHOUSE: "users.assignWarehouse",

  // Customers
  CUSTOMERS_READ: "customers.read",
  CUSTOMERS_UPDATE_BASIC: "customers.updateBasic",
  CUSTOMERS_MERGE: "customers.merge",
  CUSTOMERS_DELETE: "customers.delete",

  // Parcels
  PARCELS_READ: "parcels.read",
  PARCELS_CREATE: "parcels.create",
  PARCELS_UPDATE: "parcels.update",
  PARCELS_UPDATE_STATUS: "parcels.updateStatus",
  PARCELS_UPDATE_PRICE: "parcels.updatePrice",
  PARCELS_UPDATE_OWNER: "parcels.updateOwner",
  PARCELS_ADD_EVENT: "parcels.addEvent",
  PARCELS_MARK_UNIDENTIFIED: "parcels.markUnidentified",
  PARCELS_LINK_CUSTOMER: "parcels.linkCustomer",
  PARCELS_SOFT_DELETE: "parcels.softDelete",
  PARCELS_RESTORE: "parcels.restore",
  PARCELS_HARD_DELETE: "parcels.hardDelete",

  // Unidentified cargo & ownership claims
  UNIDENTIFIED_READ: "unidentified.read",
  UNIDENTIFIED_UPDATE: "unidentified.update",
  OWNERSHIP_CLAIMS_CREATE: "ownershipClaims.create",
  OWNERSHIP_CLAIMS_REVIEW: "ownershipClaims.review",
  OWNERSHIP_CLAIMS_OVERRIDE: "ownershipClaims.override",

  // Shipment batches & manifests
  BATCHES_READ: "batches.read",
  BATCHES_CREATE: "batches.create",
  BATCHES_UPDATE: "batches.update",
  BATCHES_ADD_ITEM: "batches.addItem",
  BATCHES_REMOVE_ITEM: "batches.removeItem",
  BATCHES_UPDATE_STATUS: "batches.updateStatus",
  BATCHES_CLOSE: "batches.close",
  BATCHES_REOPEN: "batches.reopen",
  BATCHES_CANCEL: "batches.cancel",
  MANIFESTS_READ: "manifests.read",
  MANIFESTS_EXPORT: "manifests.export",

  // Link orders
  LINK_ORDERS_READ: "linkOrders.read",
  LINK_ORDERS_UPDATE: "linkOrders.update",
  LINK_ORDERS_UPDATE_STATUS: "linkOrders.updateStatus",
  LINK_ORDERS_CANCEL: "linkOrders.cancel",
  LINK_ORDERS_LINK_PARCEL: "linkOrders.linkParcel",

  // Deliveries
  DELIVERIES_READ: "deliveries.read",
  DELIVERIES_ASSIGN: "deliveries.assign",
  DELIVERIES_UPDATE_STATUS: "deliveries.updateStatus",
  DELIVERIES_UPDATE_FEE: "deliveries.updateFee",
  DELIVERIES_CANCEL: "deliveries.cancel",

  // Tariffs
  TARIFFS_READ: "tariffs.read",
  TARIFFS_CREATE: "tariffs.create",
  TARIFFS_UPDATE: "tariffs.update",
  TARIFFS_DELETE: "tariffs.delete",
  TARIFFS_ACTIVATE: "tariffs.activate",

  // Banners & content
  CONTENT_READ: "content.read",
  CONTENT_CREATE: "content.create",
  CONTENT_UPDATE: "content.update",
  CONTENT_ACTIVATE: "content.activate",

  // Notifications
  NOTIFICATIONS_READ: "notifications.read",
  NOTIFICATIONS_SEND: "notifications.send",
  NOTIFICATIONS_CONFIGURE: "notifications.configure",

  // Reports
  REPORTS_BASIC: "reports.basic",
  REPORTS_FINANCIAL: "reports.financial",
  REPORTS_EXPORT: "reports.export",

  // Audit logs
  AUDIT_LOGS_READ: "auditLogs.read",

  // System settings
  SETTINGS_READ: "settings.read",
  SETTINGS_UPDATE: "settings.update",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS);

/**
 * Permissions granted to ADMIN. ADMIN handles daily cargo operations but must
 * NOT touch dangerous system controls (roles, tariff editing, audit logs,
 * settings, financial reports, batch reopen/cancel, claim override).
 */
const ADMIN_PERMISSIONS: Permission[] = [
  // Parcels (daily operational)
  PERMISSIONS.PARCELS_READ,
  PERMISSIONS.PARCELS_CREATE,
  PERMISSIONS.PARCELS_UPDATE,
  PERMISSIONS.PARCELS_UPDATE_STATUS,
  PERMISSIONS.PARCELS_UPDATE_PRICE,
  PERMISSIONS.PARCELS_UPDATE_OWNER,
  PERMISSIONS.PARCELS_ADD_EVENT,
  PERMISSIONS.PARCELS_MARK_UNIDENTIFIED,
  PERMISSIONS.PARCELS_LINK_CUSTOMER,
  // Unidentified cargo
  PERMISSIONS.UNIDENTIFIED_READ,
  PERMISSIONS.UNIDENTIFIED_UPDATE,
  PERMISSIONS.OWNERSHIP_CLAIMS_CREATE,
  PERMISSIONS.OWNERSHIP_CLAIMS_REVIEW,
  // Batches
  PERMISSIONS.BATCHES_READ,
  PERMISSIONS.BATCHES_CREATE,
  PERMISSIONS.BATCHES_UPDATE,
  PERMISSIONS.BATCHES_ADD_ITEM,
  PERMISSIONS.BATCHES_REMOVE_ITEM,
  PERMISSIONS.BATCHES_UPDATE_STATUS,
  PERMISSIONS.BATCHES_CLOSE,
  PERMISSIONS.MANIFESTS_READ,
  PERMISSIONS.MANIFESTS_EXPORT,
  // Link orders
  PERMISSIONS.LINK_ORDERS_READ,
  PERMISSIONS.LINK_ORDERS_UPDATE,
  PERMISSIONS.LINK_ORDERS_UPDATE_STATUS,
  PERMISSIONS.LINK_ORDERS_CANCEL,
  PERMISSIONS.LINK_ORDERS_LINK_PARCEL,
  // Deliveries
  PERMISSIONS.DELIVERIES_READ,
  PERMISSIONS.DELIVERIES_ASSIGN,
  PERMISSIONS.DELIVERIES_UPDATE_STATUS,
  PERMISSIONS.DELIVERIES_UPDATE_FEE,
  PERMISSIONS.DELIVERIES_CANCEL,
  // Customers
  PERMISSIONS.CUSTOMERS_READ,
  PERMISSIONS.CUSTOMERS_UPDATE_BASIC,
  // Tariffs (view only)
  PERMISSIONS.TARIFFS_READ,
  // Notifications (operational)
  PERMISSIONS.NOTIFICATIONS_READ,
  PERMISSIONS.NOTIFICATIONS_SEND,
  // Reports (basic operational only)
  PERMISSIONS.REPORTS_BASIC,
  PERMISSIONS.REPORTS_EXPORT,
];

/**
 * Role -> permission set. SUPER_ADMIN gets everything. WAREHOUSE_STAFF,
 * CUSTOMER and COURIER are out of scope for these dashboards (no admin
 * permissions); their dashboards are handled separately.
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.SUPER_ADMIN]: ALL_PERMISSIONS,
  [ROLES.ADMIN]: ADMIN_PERMISSIONS,
  [ROLES.WAREHOUSE_STAFF]: [],
  [ROLES.CUSTOMER]: [],
  [ROLES.COURIER]: [],
};

export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function roleHasPermission(role: Role, permission: Permission): boolean {
  return getPermissionsForRole(role).includes(permission);
}

export function roleHasAnyPermission(role: Role, permissions: Permission[]): boolean {
  const granted = getPermissionsForRole(role);
  return permissions.some((p) => granted.includes(p));
}

export function roleHasAllPermissions(role: Role, permissions: Permission[]): boolean {
  const granted = getPermissionsForRole(role);
  return permissions.every((p) => granted.includes(p));
}
