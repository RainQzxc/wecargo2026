export const ROUTES = {
  home: "/",
  track: "/track",
  pricing: "/pricing",
  linkOrder: "/link-order",
  cooperation: "/cooperation",
  guide: "/guide",
  contact: "/contact",
  login: "/auth/login",
  register: "/auth/register",
  dashboard: {
    root: "/dashboard",
    superAdmin: "/dashboard/super-admin",
    admin: "/dashboard/admin",
    warehouse: "/dashboard/warehouse",
    customer: "/dashboard/customer",
    courier: "/dashboard/courier",
  },
} as const;
