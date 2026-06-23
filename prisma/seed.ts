import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";

const db = new PrismaClient();

// Mirrors src/features/auth/password.ts. Re-implemented here because that module
// is server-only and would throw if imported outside the Next.js runtime.
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

async function main() {
  // Seed warehouses
  await db.warehouse.upsert({
    where: { id: "ereen-warehouse" },
    update: {},
    create: {
      id: "ereen-warehouse",
      name: "Эрээн агуулах",
      type: "EREEN",
      phone: "15148615407",
      addressCn: "内蒙古锡林郭勒盟二连浩特市环宇商贸城五号楼125号业顺额尔敦商贸有限公司",
      isActive: true,
    },
  });

  await db.warehouse.upsert({
    where: { id: "ub-warehouse" },
    update: {},
    create: {
      id: "ub-warehouse",
      name: "Улаанбаатар агуулах",
      type: "ULAANBAATAR",
      isActive: true,
    },
  });

  // Seed initial staff accounts so the dashboards are reachable.
  const superAdminEmail = process.env.SEED_SUPER_ADMIN_EMAIL ?? "superadmin@wecargo.mn";
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@wecargo.mn";

  await db.user.upsert({
    where: { email: superAdminEmail },
    update: { role: "SUPER_ADMIN", status: "ACTIVE" },
    create: {
      email: superAdminEmail,
      name: "Super Admin",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      passwordHash: hashPassword(process.env.SEED_SUPER_ADMIN_PASSWORD ?? "change-me-now"),
      staffProfile: { create: {} },
    },
  });

  await db.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", status: "ACTIVE" },
    create: {
      email: adminEmail,
      name: "Admin",
      role: "ADMIN",
      status: "ACTIVE",
      passwordHash: hashPassword(process.env.SEED_ADMIN_PASSWORD ?? "change-me-now"),
      staffProfile: { create: {} },
    },
  });

  console.log("Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
