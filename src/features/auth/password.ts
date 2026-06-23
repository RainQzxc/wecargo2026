import "server-only";

import crypto from "node:crypto";

/**
 * Dependency-free password hashing using scrypt. Format:
 *   scrypt$<saltHex>$<derivedKeyHex>
 * Use {@link hashPassword} when seeding/creating users and {@link verifyPassword}
 * at login. Replace with argon2/bcrypt + an auth library before production if
 * desired.
 */

const KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password, salt, KEYLEN);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string | null | undefined): boolean {
  if (!stored) return false;
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  const derived = crypto.scryptSync(password, salt, expected.length);
  return derived.length === expected.length && crypto.timingSafeEqual(derived, expected);
}
