"use server";

import { db } from "@/server/db";
import { requirePermission } from "@/features/auth";
import { revalidatePath } from "next/cache";
import { hashPassword } from "@/features/auth/password";
import type { Role } from "@/constants/roles";

const VALID_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "WAREHOUSE_STAFF",
  "CUSTOMER",
  "COURIER",
] as const;

type ValidRole = (typeof VALID_ROLES)[number];

export async function toggleUserStatus(
  userId: string,
  status: "ACTIVE" | "DISABLED"
): Promise<void> {
  await requirePermission("users.disable");
  await db.user.update({ where: { id: userId }, data: { status } });
  revalidatePath("/dashboard/super-admin/users");
}

export async function changeUserRole(
  userId: string,
  role: string
): Promise<void> {
  await requirePermission("users.changeRole");

  if (!VALID_ROLES.includes(role as ValidRole)) {
    throw new Error(
      `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`
    );
  }

  await db.user.update({ where: { id: userId }, data: { role: role as Role } });
  revalidatePath("/dashboard/super-admin/users");
  revalidatePath(`/dashboard/super-admin/users/${userId}`);
}

/**
 * Assign (or clear) a staff member's single warehouse. Upserts the staff
 * profile so it also works for a staff/admin user that has none yet.
 */
export async function assignUserWarehouse(
  userId: string,
  formData: FormData
): Promise<void> {
  await requirePermission("users.assignWarehouse");
  const raw = String(formData.get("warehouseId") ?? "").trim();
  const warehouseId = raw.length > 0 ? raw : null;
  await db.staffProfile.upsert({
    where: { userId },
    create: { userId, warehouseId },
    update: { warehouseId },
  });
  revalidatePath(`/dashboard/super-admin/users/${userId}`);
  revalidatePath("/dashboard/super-admin/users");
}

export async function resetUserPassword(
  userId: string,
  newPassword: string
): Promise<{ error?: string }> {
  try {
    await requirePermission("users.resetPassword");

    if (newPassword.length < 8) {
      return { error: "Password must be at least 8 characters long." };
    }

    const passwordHash = await hashPassword(newPassword);
    await db.user.update({ where: { id: userId }, data: { passwordHash } });

    return {};
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to reset password.";
    return { error: message };
  }
}
