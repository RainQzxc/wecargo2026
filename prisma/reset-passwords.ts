import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import crypto from "node:crypto";

/**
 * One-shot maintenance script: reset EVERY user's login password to a single
 * value (default "Testwe123", override with RESET_PASSWORD). Intended for
 * dev/test/staging databases — do not run against real production accounts.
 *
 * Usage (with DATABASE_URL pointing at the target DB):
 *   npm run db:reset-passwords
 *   RESET_PASSWORD='Other123' npm run db:reset-passwords
 */

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" });
const db = new PrismaClient({ adapter });

// Mirrors src/features/auth/password.ts (server-only, can't be imported here).
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

async function main() {
  const password = process.env.RESET_PASSWORD ?? "Testwe123";
  const result = await db.user.updateMany({
    data: { passwordHash: hashPassword(password) },
  });
  console.log(`\n✓ Reset ${result.count} user password(s) to "${password}".\n`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
