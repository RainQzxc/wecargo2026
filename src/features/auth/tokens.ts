import "server-only";

import crypto from "node:crypto";
import { db } from "@/server/db";

/**
 * Password-reset tokens. The raw token goes in the emailed link; only its
 * SHA-256 hash is persisted, so a DB leak can't be used to reset passwords.
 */

const TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

/** Create a single-use reset token for a user; returns the raw token to email. */
export async function createPasswordResetToken(userId: string): Promise<string> {
  const raw = crypto.randomBytes(32).toString("hex");
  await db.passwordResetToken.create({
    data: {
      userId,
      tokenHash: hashToken(raw),
      expiresAt: new Date(Date.now() + TTL_MS),
    },
  });
  return raw;
}

/** Resolve a raw token to its (unexpired, unused) userId, or null. */
export async function consumePasswordResetToken(raw: string): Promise<string | null> {
  const record = await db.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(raw) },
  });
  if (!record || record.usedAt || record.expiresAt < new Date()) return null;

  await db.passwordResetToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });
  return record.userId;
}
