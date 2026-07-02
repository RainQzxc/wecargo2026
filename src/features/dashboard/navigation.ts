import { ROLES, type Role } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import { getPermissionsForRole, type Permission } from "@/features/auth/permissions";
import { DASHBOARD_SECTIONS, type SectionKey } from "./features";

/**
 * Navigation map for the SUPER_ADMIN and ADMIN dashboards. Both roles live
 * under /dashboard but see different navigation. Items are filtered by the
 * viewer's permissions via {@link getNavForRole} — but visibility here is only
 * convenience; the real access control is the per-page guard in the DAL.
 */

export interface NavItem {
  sectionKey: SectionKey;
  label: string;
  href: string;
  /** Permission required to see the item. `null` = always visible in that area. */
  readPermission: Permission | null;
}

/** Mongolian nav labels — the dashboard navbar is Mongolian. */
const NAV_LABELS_MN: Record<SectionKey, string> = {
  overview: "Хянах самбар",
  users: "Хэрэглэгчид",
  customers: "Харилцагч",
  parcels: "Илгээмж",
  unidentified: "Тодорхойгүй ачаа",
  batches: "Ачилтын багц",
  "link-orders": "Линк захиалга",
  deliveries: "Хүргэлт",
  tariffs: "Тариф",
  banners: "Баннер",
  content: "Контент",
  notifications: "Мэдэгдэл",
  reports: "Тайлан",
  "audit-logs": "Аудит лог",
  settings: "Тохиргоо",
  warehouses: "Агуулах",
  branches: "Салбар",
  faq: "Асуулт & хариулт",
  testimonials: "Сэтгэгдэл",
};

function item(sectionKey: SectionKey, basePath: string, label?: string): NavItem {
  const section = DASHBOARD_SECTIONS[sectionKey];
  return {
    sectionKey,
    label: label ?? NAV_LABELS_MN[sectionKey] ?? section.title,
    href: sectionKey === "overview" ? basePath : `${basePath}/${sectionKey}`,
    readPermission: section.readPermission,
  };
}

const SUPER_ADMIN_BASE = ROUTES.dashboard.superAdmin;
const ADMIN_BASE = ROUTES.dashboard.admin;

export const SUPER_ADMIN_NAV: NavItem[] = [
  item("overview", SUPER_ADMIN_BASE),
  item("users", SUPER_ADMIN_BASE),
  item("customers", SUPER_ADMIN_BASE),
  item("parcels", SUPER_ADMIN_BASE),
  item("unidentified", SUPER_ADMIN_BASE),
  item("batches", SUPER_ADMIN_BASE),
  item("link-orders", SUPER_ADMIN_BASE),
  item("deliveries", SUPER_ADMIN_BASE),
  item("warehouses", SUPER_ADMIN_BASE),
  item("branches", SUPER_ADMIN_BASE),
  item("tariffs", SUPER_ADMIN_BASE),
  item("banners", SUPER_ADMIN_BASE),
  item("content", SUPER_ADMIN_BASE),
  item("faq", SUPER_ADMIN_BASE),
  item("testimonials", SUPER_ADMIN_BASE),
  item("notifications", SUPER_ADMIN_BASE),
  item("reports", SUPER_ADMIN_BASE),
  item("audit-logs", SUPER_ADMIN_BASE),
  item("settings", SUPER_ADMIN_BASE),
];

export const ADMIN_NAV: NavItem[] = [
  item("overview", ADMIN_BASE),
  item("parcels", ADMIN_BASE),
  item("unidentified", ADMIN_BASE),
  item("batches", ADMIN_BASE),
  item("link-orders", ADMIN_BASE),
  item("deliveries", ADMIN_BASE),
  item("customers", ADMIN_BASE),
  item("branches", ADMIN_BASE, "Салбар (харах)"),
  item("tariffs", ADMIN_BASE, "Тариф (харах)"),
  item("notifications", ADMIN_BASE),
  item("reports", ADMIN_BASE),
];

export const WAREHOUSE_NAV = [
  { label: "Үндсэн самбар", href: ROUTES.dashboard.warehouse },
  { label: "Бараа / Ачаа",  href: `${ROUTES.dashboard.warehouse}/parcels` },
  { label: "Скан",          href: `${ROUTES.dashboard.warehouse}/scan` },
  { label: "Ачааны бүлэг",  href: `${ROUTES.dashboard.warehouse}/batches` },
  { label: "Тодорхойгүй",   href: `${ROUTES.dashboard.warehouse}/unidentified` },
];

export const COURIER_NAV = [
  { label: "Үндсэн самбар",   href: ROUTES.dashboard.courier },
  { label: "Идэвхтэй хүргэлт", href: `${ROUTES.dashboard.courier}/deliveries` },
  { label: "Дууссан хүргэлт",  href: `${ROUTES.dashboard.courier}/completed` },
];

export const CUSTOMER_NAV = [
  { label: "Үндсэн самбар", href: ROUTES.dashboard.customer },
  { label: "Миний бараа",    href: `${ROUTES.dashboard.customer}/parcels` },
  { label: "Хүргэлт",       href: `${ROUTES.dashboard.customer}/delivery` },
  { label: "Линк захиалга",  href: `${ROUTES.dashboard.customer}/link-orders` },
  { label: "Хадгалалт",      href: `${ROUTES.dashboard.customer}/storage` },
  { label: "Профайл",        href: `${ROUTES.dashboard.customer}/profile` },
];

export function getNavForRole(role: Role): NavItem[] {
  const base =
    role === ROLES.SUPER_ADMIN ? SUPER_ADMIN_NAV : role === ROLES.ADMIN ? ADMIN_NAV : [];
  const granted = getPermissionsForRole(role);
  return base.filter(
    (nav) => nav.readPermission === null || granted.includes(nav.readPermission),
  );
}

/** Dashboard root each role should land on after login. */
export function getDashboardHomeForRole(role: Role): string {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return ROUTES.dashboard.superAdmin;
    case ROLES.ADMIN:
      return ROUTES.dashboard.admin;
    case ROLES.WAREHOUSE_STAFF:
      return ROUTES.dashboard.warehouse;
    case ROLES.COURIER:
      return ROUTES.dashboard.courier;
    case ROLES.CUSTOMER:
    default:
      return ROUTES.dashboard.customer;
  }
}
