"use server";

import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { writeAuditLog } from "@/lib/audit";
import { normalizePhone } from "@/lib/phone";
import { AUDIT_ACTIONS } from "@/constants/audit-actions";
import { ROUTES } from "@/constants/routes";
import type { Role } from "@/constants/roles";
import { createSession, destroySession } from "./session";
import { getCurrentUser } from "./dal";
import { verifyPassword } from "./password";

export interface LoginState {
  error?: string;
}

/**
 * Credential login server action (email or phone + password). Sets the session
 * cookie and redirects to the role-based dashboard root. Authorization for what
 * the user can then do is enforced per-page/action via the DAL guards.
 */
export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!identifier || !password) {
    return { error: "Нэвтрэх нэр болон нууц үг шаардлагатай." };
  }

  const phoneNormalized = normalizePhone(identifier);
  const user = await db.user.findFirst({
    where: {
      OR: [
        { email: identifier.toLowerCase() },
        { phoneNormalized },
      ],
    },
    select: { id: true, role: true, status: true, passwordHash: true },
  });

  const ok = user ? verifyPassword(password, user.passwordHash) : false;
  if (!user || !ok) {
    await writeAuditLog({
      action: AUDIT_ACTIONS.AUTH_LOGIN_FAILED,
      entityType: "User",
      entityId: user?.id,
      metadata: { identifier },
    });
    return { error: "Нэвтрэх нэр эсвэл нууц үг буруу байна." };
  }

  if (user.status === "DISABLED") {
    return { error: "Энэ хэрэглэгчийн эрх хаагдсан байна." };
  }

  await createSession(user.id, user.role as Role);
  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await writeAuditLog({
    actorId: user.id,
    action: AUDIT_ACTIONS.AUTH_LOGIN,
    entityType: "User",
    entityId: user.id,
  });

  redirect(ROUTES.dashboard.root);
}

export async function logout(): Promise<void> {
  const user = await getCurrentUser();
  if (user) {
    await writeAuditLog({
      actorId: user.id,
      action: AUDIT_ACTIONS.AUTH_LOGOUT,
      entityType: "User",
      entityId: user.id,
    });
  }
  await destroySession();
  redirect(ROUTES.login);
}
