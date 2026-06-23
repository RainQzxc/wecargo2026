export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  WAREHOUSE_STAFF: "WAREHOUSE_STAFF",
  CUSTOMER: "CUSTOMER",
  COURIER: "COURIER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
