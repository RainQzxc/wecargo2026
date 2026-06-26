import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 is Rust-free: the client connects through a driver adapter rather
// than a `datasourceUrl`. The CLI/migrations read DATABASE_URL via
// prisma.config.ts; the runtime client needs the adapter here.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient(): PrismaClient {
  const raw = process.env.DATABASE_URL ?? "";

  // Supabase's connection pooler serves a TLS cert that isn't in Node's trust
  // store. Newer `pg` treats `sslmode=require` as `verify-full`, which rejects
  // it with SELF_SIGNED_CERT_IN_CHAIN — every query throws on Vercel. Strip any
  // sslmode from the URL (it would otherwise win over the ssl option below) and
  // configure TLS explicitly: encrypted, but without CA verification.
  let connectionString = raw;
  try {
    const u = new URL(raw);
    u.searchParams.delete("sslmode");
    connectionString = u.toString();
  } catch {
    // Not a parseable URL — use as-is.
  }

  const isSupabase = /supabase\.(co|com)/.test(raw);
  const adapter = new PrismaPg({
    connectionString,
    ...(isSupabase ? { ssl: { rejectUnauthorized: false } } : {}),
  });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
