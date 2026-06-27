import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { captureRedirect, redirect } from "../../helpers/next-navigation";

const { dbMock, requirePermission, revalidatePath } = vi.hoisted(() => ({
  dbMock: {
    warehouse: { create: vi.fn(), update: vi.fn(), findUnique: vi.fn() },
    auditLog: { create: vi.fn() },
  },
  requirePermission: vi.fn(),
  revalidatePath: vi.fn(),
}));
vi.mock("@/server/db", () => ({ db: dbMock }));
vi.mock("@/features/auth", () => ({ requirePermission }));
vi.mock("next/cache", () => ({ revalidatePath }));
vi.mock("next/navigation", () => ({ redirect, forbidden: vi.fn() }));
// @prisma/client is not generated in this environment; stub the enum the action
// imports so the module can load under Vitest.
vi.mock("@prisma/client", () => ({
  WarehouseType: { EREEN: "EREEN", ULAANBAATAR: "ULAANBAATAR", OTHER: "OTHER" },
}));

import { createWarehouse } from "@/features/warehouses/actions";
import { AUDIT_ACTIONS } from "@/constants/audit-actions";

const BASE = "/dashboard/super-admin/warehouses";

function formData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

beforeEach(() => {
  requirePermission.mockResolvedValue({ id: "actor-1" });
  dbMock.warehouse.create.mockResolvedValue({ id: "w1" });
  dbMock.auditLog.create.mockResolvedValue({});
});
afterEach(() => {
  vi.clearAllMocks();
});

describe("createWarehouse", () => {
  it("redirects to the form with ?error=name when name is blank", async () => {
    const target = await captureRedirect(() => createWarehouse(formData({ name: "" })));
    expect(target).toBe(`${BASE}/new?error=name`);
    expect(dbMock.warehouse.create).not.toHaveBeenCalled();
  });

  it("keeps a recognized warehouse type", async () => {
    await captureRedirect(() =>
      createWarehouse(formData({ name: "Ereen Hub", type: "EREEN" })),
    );
    expect(dbMock.warehouse.create.mock.calls[0][0].data.type).toBe("EREEN");
  });

  it("falls back to OTHER for an unrecognized type", async () => {
    await captureRedirect(() =>
      createWarehouse(formData({ name: "Mystery", type: "MARS" })),
    );
    expect(dbMock.warehouse.create.mock.calls[0][0].data.type).toBe("OTHER");
  });

  it("trims fields, coerces empties to null, and audits the create", async () => {
    const target = await captureRedirect(() =>
      createWarehouse(
        formData({ name: "  UB Depot  ", addressMn: " Хан-Уул ", phone: "", isActive: "on" }),
      ),
    );

    const data = dbMock.warehouse.create.mock.calls[0][0].data;
    expect(data.name).toBe("UB Depot");
    expect(data.addressMn).toBe("Хан-Уул");
    expect(data.phone).toBeNull();
    expect(data.isActive).toBe(true);

    expect(dbMock.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ action: AUDIT_ACTIONS.WAREHOUSE_CREATED }),
      }),
    );
    expect(revalidatePath).toHaveBeenCalledWith(BASE);
    expect(target).toBe(BASE);
  });
});
