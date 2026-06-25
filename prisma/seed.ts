import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import crypto from "node:crypto";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" });
const db = new PrismaClient({ adapter });

// Mirrors src/features/auth/password.ts. Re-implemented here because that module
// is server-only and would throw if imported outside the Next.js runtime.
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

async function main() {
  // ── Warehouses ──────────────────────────────────────────────────────────────
  await db.warehouse.upsert({
    where: { id: "ereen-warehouse" },
    update: {},
    create: {
      id: "ereen-warehouse",
      name: "Эрээн агуулах",
      type: "EREEN",
      phone: "15148615407",
      addressCn:
        "内蒙古锡林郭勒盟二连浩特市环宇商贸城五号楼125号业顺额尔敦商贸有限公司",
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

  // ── SUPER ADMIN ─────────────────────────────────────────────────────────────
  const superAdminEmail =
    process.env.SEED_SUPER_ADMIN_EMAIL ?? "superadmin@wecargo.mn";
  const superAdminPassword =
    process.env.SEED_SUPER_ADMIN_PASSWORD ?? "SuperAdmin@2026";

  await db.user.upsert({
    where: { email: superAdminEmail },
    update: { role: "SUPER_ADMIN", status: "ACTIVE" },
    create: {
      email: superAdminEmail,
      name: "Super Admin",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      passwordHash: hashPassword(superAdminPassword),
      staffProfile: { create: {} },
    },
  });

  // ── ADMIN ────────────────────────────────────────────────────────────────────
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@wecargo.mn";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin@2026";

  await db.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", status: "ACTIVE" },
    create: {
      email: adminEmail,
      name: "Admin",
      role: "ADMIN",
      status: "ACTIVE",
      passwordHash: hashPassword(adminPassword),
      staffProfile: { create: {} },
    },
  });

  // ── WAREHOUSE STAFF (Other) ───────────────────────────────────────────────
  const staffEmail = process.env.SEED_STAFF_EMAIL ?? "staff@wecargo.mn";
  const staffPassword = process.env.SEED_STAFF_PASSWORD ?? "Staff@2026";

  await db.user.upsert({
    where: { email: staffEmail },
    update: { role: "WAREHOUSE_STAFF", status: "ACTIVE" },
    create: {
      email: staffEmail,
      name: "Warehouse Staff",
      role: "WAREHOUSE_STAFF",
      status: "ACTIVE",
      passwordHash: hashPassword(staffPassword),
      staffProfile: {
        create: {
          warehouseId: "ereen-warehouse",
        },
      },
    },
  });

  // ── COURIER ───────────────────────────────────────────────────────────────
  const courierEmail = process.env.SEED_COURIER_EMAIL ?? "courier@wecargo.mn";
  const courierPassword = process.env.SEED_COURIER_PASSWORD ?? "Courier@2026";

  await db.user.upsert({
    where: { email: courierEmail },
    update: { role: "COURIER", status: "ACTIVE" },
    create: {
      email: courierEmail,
      name: "Courier",
      role: "COURIER",
      status: "ACTIVE",
      passwordHash: hashPassword(courierPassword),
      staffProfile: { create: {} },
    },
  });

  // ── CUSTOMER ──────────────────────────────────────────────────────────────
  const customerEmail =
    process.env.SEED_CUSTOMER_EMAIL ?? "customer@wecargo.mn";
  const customerPassword =
    process.env.SEED_CUSTOMER_PASSWORD ?? "Customer@2026";

  await db.user.upsert({
    where: { email: customerEmail },
    update: { role: "CUSTOMER", status: "ACTIVE" },
    create: {
      email: customerEmail,
      name: "Customer",
      role: "CUSTOMER",
      status: "ACTIVE",
      passwordHash: hashPassword(customerPassword),
      customerProfile: {
        create: {
          customerCode: "WC-TEST-001",
        },
      },
    },
  });

  console.log("\n✓ Seed complete.\n");
  console.log("─────────────────────────────────────────────────");
  console.log("Role            Email                   Password");
  console.log("─────────────────────────────────────────────────");
  console.log(`SUPER_ADMIN     ${superAdminEmail.padEnd(24)}${superAdminPassword}`);
  console.log(`ADMIN           ${adminEmail.padEnd(24)}${adminPassword}`);
  console.log(`WAREHOUSE_STAFF ${staffEmail.padEnd(24)}${staffPassword}`);
  console.log(`COURIER         ${courierEmail.padEnd(24)}${courierPassword}`);
  console.log(`CUSTOMER        ${customerEmail.padEnd(24)}${customerPassword}`);
  console.log("─────────────────────────────────────────────────\n");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
