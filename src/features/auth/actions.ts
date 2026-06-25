"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/server/db";
import { writeAuditLog } from "@/lib/audit";
import { normalizePhone } from "@/lib/phone";
import { rateLimit } from "@/lib/rate-limit";
import { sendEmail, passwordResetEmail, welcomeEmail } from "@/lib/email";
import { AUDIT_ACTIONS } from "@/constants/audit-actions";
import { ROUTES } from "@/constants/routes";
import type { Role } from "@/constants/roles";
import { createSession, destroySession } from "./session";
import { getCurrentUser } from "./dal";
import { verifyPassword, hashPassword } from "./password";
import { createPasswordResetToken, consumePasswordResetToken } from "./tokens";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

async function baseUrl(): Promise<string> {
  const env = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL;
  if (env) return env.replace(/\/$/, "");
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export interface LoginState {
  error?: string;
}

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!identifier || !password) {
    return { error: "Нэвтрэх нэр болон нууц үг шаардлагатай." };
  }

  const limit = rateLimit(`login:${await clientIp()}`, 10, 60_000);
  if (!limit.ok) {
    return { error: `Хэт олон оролдлого. ${limit.retryAfterSec} секундын дараа дахин оролдоно уу.` };
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

    // Non-critical updates — don't block login if they fail
    Promise.all([
      db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }),
      writeAuditLog({
        actorId: user.id,
        action: AUDIT_ACTIONS.AUTH_LOGIN,
        entityType: "User",
        entityId: user.id,
      }),
    ]).catch((err) => console.error("[login] post-login tasks failed:", err));
  } catch (err) {
    console.error("[login] Unexpected error:", err);
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
    console.error("[logout] Failed to write audit log:", err);
  } finally {
    await destroySession();
  }
  redirect(ROUTES.login);
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

export interface RegisterState {
  error?: string;
}

export async function register(_state: RegisterState, formData: FormData): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!name || !email || !password) {
    return { error: "Нэр, имэйл, нууц үг шаардлагатай." };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Имэйл хаяг буруу байна." };
  }
  if (password.length < 6) {
    return { error: "Нууц үг доод тал нь 6 тэмдэгт байх ёстой." };
  }
  if (password !== confirm) {
    return { error: "Нууц үг таарахгүй байна." };
  }

  const limit = rateLimit(`register:${await clientIp()}`, 5, 60 * 60_000);
  if (!limit.ok) {
    return { error: `Хэт олон оролдлого. ${limit.retryAfterSec} секундын дараа дахин оролдоно уу.` };
  }

  const phoneNormalized = phone ? normalizePhone(phone) : null;

  let userId: string;
  try {
    const existing = await db.user.findFirst({
      where: {
        OR: [
          { email },
          ...(phoneNormalized ? [{ phoneNormalized }] : []),
        ],
      },
      select: { id: true },
    });
    if (existing) {
      return { error: "Энэ имэйл эсвэл утсаар бүртгэл аль хэдийн үүссэн байна." };
    }

    const user = await db.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        phoneNormalized,
        passwordHash: hashPassword(password),
        role: "CUSTOMER",
        status: "ACTIVE",
      },
      select: { id: true },
    });
    userId = user.id;

    await createSession(userId, "CUSTOMER");

    // Non-critical — don't block signup if these fail.
    const loginUrl = `${await baseUrl()}${ROUTES.login}`;
    const tpl = welcomeEmail(name, loginUrl);
    Promise.all([
      writeAuditLog({
        actorId: userId,
        action: AUDIT_ACTIONS.AUTH_REGISTERED,
        entityType: "User",
        entityId: userId,
      }),
      sendEmail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text }),
    ]).catch((err) => console.error("[register] post-signup tasks failed:", err));
  } catch (err) {
    console.error("[register] Unexpected error:", err);
    return { error: "Системийн алдаа гарлаа. Дахин оролдоно уу." };
  }

  redirect(ROUTES.dashboard.root);
}

// ---------------------------------------------------------------------------
// Password reset — request
// ---------------------------------------------------------------------------

export interface ForgotPasswordState {
  sent?: boolean;
  error?: string;
}

export async function requestPasswordReset(
  _state: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { error: "Имэйл хаяг буруу байна." };
  }

  const limit = rateLimit(`reset-req:${await clientIp()}`, 5, 15 * 60_000);
  if (!limit.ok) {
    return { error: `Хэт олон оролдлого. ${limit.retryAfterSec} секундын дараа дахин оролдоно уу.` };
  }

  try {
    const user = await db.user.findFirst({
      where: { email, status: "ACTIVE" },
      select: { id: true },
    });

    // Always report "sent" — never reveal whether the email is registered.
    if (user) {
      const raw = await createPasswordResetToken(user.id);
      const resetUrl = `${await baseUrl()}${ROUTES.resetPassword}?token=${raw}`;
      const tpl = passwordResetEmail(resetUrl);
      await Promise.all([
        sendEmail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text }),
        writeAuditLog({
          actorId: user.id,
          action: AUDIT_ACTIONS.USER_PASSWORD_RESET_REQUESTED,
          entityType: "User",
          entityId: user.id,
        }),
      ]);
    }
  } catch (err) {
    console.error("[requestPasswordReset] error:", err);
    // Still report sent — don't leak failures or existence.
  }

  return { sent: true };
}

// ---------------------------------------------------------------------------
// Password reset — complete
// ---------------------------------------------------------------------------

export interface ResetPasswordState {
  error?: string;
  success?: boolean;
}

export async function resetPassword(
  _state: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!token) return { error: "Холбоос буруу байна." };
  if (password.length < 6) return { error: "Нууц үг доод тал нь 6 тэмдэгт байх ёстой." };
  if (password !== confirm) return { error: "Нууц үг таарахгүй байна." };

  const limit = rateLimit(`reset:${await clientIp()}`, 10, 15 * 60_000);
  if (!limit.ok) {
    return { error: `Хэт олон оролдлого. ${limit.retryAfterSec} секундын дараа дахин оролдоно уу.` };
  }

  try {
    const userId = await consumePasswordResetToken(token);
    if (!userId) {
      return { error: "Холбоос хүчингүй эсвэл хугацаа дууссан байна. Дахин хүсэлт илгээнэ үү." };
    }

    await db.user.update({
      where: { id: userId },
      data: { passwordHash: hashPassword(password) },
    });

    await writeAuditLog({
      actorId: userId,
      action: AUDIT_ACTIONS.AUTH_PASSWORD_RESET_COMPLETED,
      entityType: "User",
      entityId: userId,
    });
  } catch (err) {
    console.error("[resetPassword] error:", err);
    return { error: "Системийн алдаа гарлаа. Дахин оролдоно уу." };
  }

  return { success: true };
}
