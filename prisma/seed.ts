import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

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

  console.log("Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
