import "server-only";

import { cache } from "react";
import { forbidden, redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/constants/routes";
import type { Role } from "@/constants/roles";
import { readSession } from "./session";
import {
  getPermissionsForRole,
  roleHasAllPermissions,
  roleHasAnyPermission,
  roleHasPermission,
  type Permission,
} from "./permissions";

/**
 * Data Access Layer — the single source of truth for "who is the current user
 * and what may they do". Page components, layouts, server actions and route
 * handlers MUST call one of the `require*` guards before reading/mutating data.
 *
 * The session cookie is treated as untrusted: role + status are always
 * re-fetched from the DB here, so a disabled user or a role change takes effect
 * immediately regardless of the cookie contents.
 */

export interface CurrentUser {
  id: string;
  role: Role;
  status: string;
  name: string | null;
  email: string | null;
  phone: string | null;
}

/** Returns the authenticated, enabled user or null. Memoized per request. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await readSession();
  if (!session?.userId) return null;

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      role: true,
      status: true,
      name: true,
      email: true,
      phone: true,
    },
  });

  if (!user || user.status === "DISABLED") return null;
  return user as CurrentUser;
});

/** Authenticated user, or redirect to login. */
export async function requireAuth(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(ROUTES.login);
  return user;
}

/** Authenticated user whose role is one of `roles`, or 403. */
export async function requireRole(...roles: Role[]): Promise<CurrentUser> {
  const user = await requireAuth();
  if (!roles.includes(user.role)) forbidden();
  return user;
}

/** Authenticated user holding `permission`, or 403. */
export async function requirePermission(permission: Permission): Promise<CurrentUser> {
  const user = await requireAuth();
  if (!roleHasPermission(user.role, permission)) forbidden();
  return user;
}

/** Authenticated user holding at least one of `permissions`, or 403. */
export async function requireAnyPermission(permissions: Permission[]): Promise<CurrentUser> {
  const user = await requireAuth();
  if (!roleHasAnyPermission(user.role, permissions)) forbidden();
  return user;
}

/** Authenticated user holding all of `permissions`, or 403. */
export async function requireAllPermissions(permissions: Permission[]): Promise<CurrentUser> {
  const user = await requireAuth();
  if (!roleHasAllPermissions(user.role, permissions)) forbidden();
  return user;
}

/**
 * Non-throwing permission check for the current user — use to show/hide UI.
 * Never rely on this for security; the matching `require*` guard must still run
 * on the server before any read/mutation.
 */
export async function can(permission: Permission): Promise<boolean> {
  const user = await getCurrentUser();
  return user ? roleHasPermission(user.role, permission) : false;
}

/** All permissions for the current user (empty if unauthenticated). */
export async function getCurrentUserPermissions(): Promise<Permission[]> {
  const user = await getCurrentUser();
  return user ? getPermissionsForRole(user.role) : [];
}
