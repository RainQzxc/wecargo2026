import { PERMISSIONS, type Permission } from "@/features/auth/permissions";
import { AUDIT_ACTIONS, type AuditAction } from "@/constants/audit-actions";

/**
 * Dashboard feature map — the functional spec for each WECARGO internal
 * dashboard section, expressed in code. For every section it records:
 *  - the title,
 *  - the permission required to read it (`readPermission`),
 *  - the per-action permissions it exposes,
 *  - the audit actions its mutations must emit.
 *
 * Pages, server actions and the navigation map all derive from this single
 * source so feature structure, permissions and audit stay in sync.
 */

export type SectionKey =
  | "overview"
  | "users"
  | "customers"
  | "parcels"
  | "unidentified"
  | "batches"
  | "link-orders"
  | "deliveries"
  | "tariffs"
  | "banners"
  | "notifications"
  | "reports"
  | "audit-logs"
  | "settings";

export interface DashboardSection {
  key: SectionKey;
  title: string;
  description: string;
  /** Permission required to open/read the section. `null` = any dashboard user. */
  readPermission: Permission | null;
  /** Named actions -> permission needed to perform them. */
  actions: Record<string, Permission>;
  /** Audit actions the section's mutations must write. */
  auditActions: AuditAction[];
}

export const DASHBOARD_SECTIONS: Record<SectionKey, DashboardSection> = {
  overview: {
    key: "overview",
    title: "Overview",
    description: "High-level operational summary, recent activity and quick actions.",
    readPermission: null,
    actions: {},
    auditActions: [],
  },
  users: {
    key: "users",
    title: "Users & Staff",
    description: "Manage staff accounts, roles, status and warehouse assignment.",
    readPermission: PERMISSIONS.USERS_READ,
    actions: {
      create: PERMISSIONS.USERS_CREATE,
      update: PERMISSIONS.USERS_UPDATE,
      disable: PERMISSIONS.USERS_DISABLE,
      changeRole: PERMISSIONS.USERS_CHANGE_ROLE,
      resetPassword: PERMISSIONS.USERS_RESET_PASSWORD,
      assignWarehouse: PERMISSIONS.USERS_ASSIGN_WAREHOUSE,
    },
    auditActions: [
      AUDIT_ACTIONS.USER_CREATED,
      AUDIT_ACTIONS.USER_UPDATED,
      AUDIT_ACTIONS.USER_DISABLED,
      AUDIT_ACTIONS.USER_ENABLED,
      AUDIT_ACTIONS.USER_ROLE_CHANGED,
      AUDIT_ACTIONS.USER_PASSWORD_RESET_REQUESTED,
    ],
  },
  customers: {
    key: "customers",
    title: "Customers",
    description: "Customer records, their parcels, link orders and delivery requests.",
    readPermission: PERMISSIONS.CUSTOMERS_READ,
    actions: {
      updateBasic: PERMISSIONS.CUSTOMERS_UPDATE_BASIC,
      merge: PERMISSIONS.CUSTOMERS_MERGE,
      delete: PERMISSIONS.CUSTOMERS_DELETE,
    },
    auditActions: [AUDIT_ACTIONS.CUSTOMER_UPDATED, AUDIT_ACTIONS.CUSTOMER_MERGED],
  },
  parcels: {
    key: "parcels",
    title: "Parcels",
    description: "All parcels: search, create, edit, status, price, owner, soft delete.",
    readPermission: PERMISSIONS.PARCELS_READ,
    actions: {
      create: PERMISSIONS.PARCELS_CREATE,
      update: PERMISSIONS.PARCELS_UPDATE,
      updateStatus: PERMISSIONS.PARCELS_UPDATE_STATUS,
      updatePrice: PERMISSIONS.PARCELS_UPDATE_PRICE,
      updateOwner: PERMISSIONS.PARCELS_UPDATE_OWNER,
      addEvent: PERMISSIONS.PARCELS_ADD_EVENT,
      markUnidentified: PERMISSIONS.PARCELS_MARK_UNIDENTIFIED,
      linkCustomer: PERMISSIONS.PARCELS_LINK_CUSTOMER,
      softDelete: PERMISSIONS.PARCELS_SOFT_DELETE,
      restore: PERMISSIONS.PARCELS_RESTORE,
      hardDelete: PERMISSIONS.PARCELS_HARD_DELETE,
    },
    auditActions: [
      AUDIT_ACTIONS.PARCEL_CREATED,
      AUDIT_ACTIONS.PARCEL_UPDATED,
      AUDIT_ACTIONS.PARCEL_STATUS_CHANGED,
      AUDIT_ACTIONS.PARCEL_PRICE_UPDATED,
      AUDIT_ACTIONS.PARCEL_OWNER_UPDATED,
      AUDIT_ACTIONS.PARCEL_MARKED_UNIDENTIFIED,
      AUDIT_ACTIONS.PARCEL_LINKED_TO_CUSTOMER,
      AUDIT_ACTIONS.PARCEL_DELETED,
      AUDIT_ACTIONS.PARCEL_RESTORED,
    ],
  },
  unidentified: {
    key: "unidentified",
    title: "Unidentified Cargo",
    description:
      "Parcels with ownerStatus=UNIDENTIFIED & no customer. Review and resolve ownership claims.",
    readPermission: PERMISSIONS.UNIDENTIFIED_READ,
    actions: {
      update: PERMISSIONS.UNIDENTIFIED_UPDATE,
      createClaim: PERMISSIONS.OWNERSHIP_CLAIMS_CREATE,
      reviewClaim: PERMISSIONS.OWNERSHIP_CLAIMS_REVIEW,
      overrideClaim: PERMISSIONS.OWNERSHIP_CLAIMS_OVERRIDE,
    },
    auditActions: [
      AUDIT_ACTIONS.OWNERSHIP_CLAIM_CREATED,
      AUDIT_ACTIONS.OWNERSHIP_CLAIM_APPROVED,
      AUDIT_ACTIONS.OWNERSHIP_CLAIM_REJECTED,
      AUDIT_ACTIONS.UNIDENTIFIED_CARGO_UPDATED,
      AUDIT_ACTIONS.UNIDENTIFIED_CARGO_RESOLVED,
    ],
  },
  batches: {
    key: "batches",
    title: "Shipment Batches",
    description: "Groups of parcels loaded Ereen→Ulaanbaatar; generate and export manifests.",
    readPermission: PERMISSIONS.BATCHES_READ,
    actions: {
      create: PERMISSIONS.BATCHES_CREATE,
      update: PERMISSIONS.BATCHES_UPDATE,
      addItem: PERMISSIONS.BATCHES_ADD_ITEM,
      removeItem: PERMISSIONS.BATCHES_REMOVE_ITEM,
      updateStatus: PERMISSIONS.BATCHES_UPDATE_STATUS,
      close: PERMISSIONS.BATCHES_CLOSE,
      reopen: PERMISSIONS.BATCHES_REOPEN,
      cancel: PERMISSIONS.BATCHES_CANCEL,
      readManifest: PERMISSIONS.MANIFESTS_READ,
      exportManifest: PERMISSIONS.MANIFESTS_EXPORT,
    },
    auditActions: [
      AUDIT_ACTIONS.BATCH_CREATED,
      AUDIT_ACTIONS.BATCH_UPDATED,
      AUDIT_ACTIONS.BATCH_ITEM_ADDED,
      AUDIT_ACTIONS.BATCH_ITEM_REMOVED,
      AUDIT_ACTIONS.BATCH_STATUS_CHANGED,
      AUDIT_ACTIONS.MANIFEST_VIEWED,
      AUDIT_ACTIONS.MANIFEST_EXPORTED,
      AUDIT_ACTIONS.BATCH_CANCELLED,
      AUDIT_ACTIONS.BATCH_REOPENED,
    ],
  },
  "link-orders": {
    key: "link-orders",
    title: "Link Orders",
    description: "Customer product-link orders; pricing, seller track codes, link to parcel.",
    readPermission: PERMISSIONS.LINK_ORDERS_READ,
    actions: {
      update: PERMISSIONS.LINK_ORDERS_UPDATE,
      updateStatus: PERMISSIONS.LINK_ORDERS_UPDATE_STATUS,
      cancel: PERMISSIONS.LINK_ORDERS_CANCEL,
      linkParcel: PERMISSIONS.LINK_ORDERS_LINK_PARCEL,
    },
    auditActions: [
      AUDIT_ACTIONS.LINK_ORDER_CREATED,
      AUDIT_ACTIONS.LINK_ORDER_UPDATED,
      AUDIT_ACTIONS.LINK_ORDER_STATUS_CHANGED,
      AUDIT_ACTIONS.LINK_ORDER_TRACK_CODE_ADDED,
      AUDIT_ACTIONS.LINK_ORDER_LINKED_TO_PARCEL,
      AUDIT_ACTIONS.LINK_ORDER_CANCELLED,
    ],
  },
  deliveries: {
    key: "deliveries",
    title: "Deliveries",
    description: "Delivery requests: assign couriers, fees, status, failed reasons.",
    readPermission: PERMISSIONS.DELIVERIES_READ,
    actions: {
      assign: PERMISSIONS.DELIVERIES_ASSIGN,
      updateStatus: PERMISSIONS.DELIVERIES_UPDATE_STATUS,
      updateFee: PERMISSIONS.DELIVERIES_UPDATE_FEE,
      cancel: PERMISSIONS.DELIVERIES_CANCEL,
    },
    auditActions: [
      AUDIT_ACTIONS.DELIVERY_ASSIGNED,
      AUDIT_ACTIONS.DELIVERY_REASSIGNED,
      AUDIT_ACTIONS.DELIVERY_STATUS_CHANGED,
      AUDIT_ACTIONS.DELIVERY_FEE_UPDATED,
      AUDIT_ACTIONS.DELIVERY_CANCELLED,
    ],
  },
  tariffs: {
    key: "tariffs",
    title: "Tariffs",
    description: "Configurable tariff rules. SUPER_ADMIN edits; ADMIN views for reference.",
    readPermission: PERMISSIONS.TARIFFS_READ,
    actions: {
      create: PERMISSIONS.TARIFFS_CREATE,
      update: PERMISSIONS.TARIFFS_UPDATE,
      delete: PERMISSIONS.TARIFFS_DELETE,
      activate: PERMISSIONS.TARIFFS_ACTIVATE,
    },
    auditActions: [
      AUDIT_ACTIONS.TARIFF_CREATED,
      AUDIT_ACTIONS.TARIFF_UPDATED,
      AUDIT_ACTIONS.TARIFF_ACTIVATED,
      AUDIT_ACTIONS.TARIFF_DEACTIVATED,
      AUDIT_ACTIONS.TARIFF_DELETED,
    ],
  },
  banners: {
    key: "banners",
    title: "Banners & Content",
    description: "Landing banners, alerts and content blocks with placement & scheduling.",
    readPermission: PERMISSIONS.CONTENT_READ,
    actions: {
      create: PERMISSIONS.CONTENT_CREATE,
      update: PERMISSIONS.CONTENT_UPDATE,
      activate: PERMISSIONS.CONTENT_ACTIVATE,
    },
    auditActions: [
      AUDIT_ACTIONS.BANNER_CREATED,
      AUDIT_ACTIONS.BANNER_UPDATED,
      AUDIT_ACTIONS.BANNER_ACTIVATED,
      AUDIT_ACTIONS.BANNER_DEACTIVATED,
      AUDIT_ACTIONS.CONTENT_UPDATED,
    ],
  },
  notifications: {
    key: "notifications",
    title: "Notifications",
    description: "Notification logs (SMS/EMAIL/PUSH/IN_APP), manual sends, provider config.",
    readPermission: PERMISSIONS.NOTIFICATIONS_READ,
    actions: {
      send: PERMISSIONS.NOTIFICATIONS_SEND,
      configure: PERMISSIONS.NOTIFICATIONS_CONFIGURE,
    },
    auditActions: [
      AUDIT_ACTIONS.NOTIFICATION_SENT,
      AUDIT_ACTIONS.NOTIFICATION_FAILED,
      AUDIT_ACTIONS.NOTIFICATION_RETRIED,
      AUDIT_ACTIONS.BULK_NOTIFICATION_SENT,
      AUDIT_ACTIONS.NOTIFICATION_SETTINGS_UPDATED,
    ],
  },
  reports: {
    key: "reports",
    title: "Reports",
    description: "Operational reports. Financial/revenue reports are SUPER_ADMIN only.",
    readPermission: PERMISSIONS.REPORTS_BASIC,
    actions: {
      financial: PERMISSIONS.REPORTS_FINANCIAL,
      export: PERMISSIONS.REPORTS_EXPORT,
    },
    auditActions: [AUDIT_ACTIONS.REPORT_VIEWED, AUDIT_ACTIONS.REPORT_EXPORTED],
  },
  "audit-logs": {
    key: "audit-logs",
    title: "Audit Logs",
    description: "Read-only audit trail. SUPER_ADMIN only. Never editable/deletable from UI.",
    readPermission: PERMISSIONS.AUDIT_LOGS_READ,
    actions: {},
    auditActions: [],
  },
  settings: {
    key: "settings",
    title: "System Settings",
    description: "Company info, currency, SMS provider, visibility & feature toggles.",
    readPermission: PERMISSIONS.SETTINGS_READ,
    actions: {
      update: PERMISSIONS.SETTINGS_UPDATE,
    },
    auditActions: [AUDIT_ACTIONS.SYSTEM_SETTING_UPDATED],
  },
};

export function getSection(key: SectionKey): DashboardSection {
  return DASHBOARD_SECTIONS[key];
}
