"use server";

import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { writeAuditLog } from "@/lib/audit";
import { logger } from "@/lib/logger";
import { normalizePhone } from "@/lib/phone";
import { AUDIT_ACTIONS } from "@/constants/audit-actions";
import { ROUTES } from "@/constants/routes";
import type { Role } from "@/constants/roles";
import { createSession, destroySession } from "./session";
import { getCurrentUser } from "./dal";
import { verifyPassword } from "./password";
import { loginRateLimiter } from "./rate-limit";

export interface LoginState {
  error?: string;
}

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!identifier || !password) {
    return { error: "Нэвтрэх нэр болон нууц үг шаардлагатай." };
  }

  // Brute-force defense: throttle attempts per identifier before any DB work.
  const rateKey = identifier.toLowerCase();
  if (!loginRateLimiter.check(rateKey).allowed) {
    return { error: "Хэт олон удаа оролдлоо. Түр хүлээгээд дахин оролдоно уу." };
  }

  try {
    const phoneNormalized = normalizePhone(identifier);
    const user = await db.user.findFirst({
      where: {
        OR: [{ email: identifier.toLowerCase() }, { phoneNormalized }],
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
    loginRateLimiter.reset(rateKey); // clear throttle on a successful login

    // Non-critical updates — don't block login if they fail
    Promise.all([
      db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }),
      writeAuditLog({
        actorId: user.id,
        action: AUDIT_ACTIONS.AUTH_LOGIN,
        entityType: "User",
        entityId: user.id,
      }),
    ]).catch((err) => logger.error("login", "post-login tasks failed", { err }));
  } catch (err) {
    logger.captureException("login", err);
    return { error: "Системийн алдаа гарлаа. Дахин оролдоно уу." };
  }

  redirect(ROUTES.dashboard.root);
}

export async function logout(): Promise<void> {
  try {
    const user = await getCurrentUser();
    if (user) {
      await writeAuditLog({
        actorId: user.id,
        action: AUDIT_ACTIONS.AUTH_LOGOUT,
        entityType: "User",
        entityId: user.id,
      });
    }
  } catch (err) {
    logger.captureException("logout", err);
  } finally {
    await destroySession();
  }
  redirect(ROUTES.login);
}
