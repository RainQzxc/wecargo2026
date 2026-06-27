import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { captureRedirect, redirect } from "../../helpers/next-navigation";

// ---- Mocks ----------------------------------------------------------------
// `vi.hoisted` lets these mocks exist before the hoisted `vi.mock` factories run.
// Authorization is exercised separately (permissions.test.ts); here we assume an
// authorized actor so we can focus on the action's own validation/branching.
const { dbMock, requirePermission, revalidatePath } = vi.hoisted(() => ({
  dbMock: {
    branch: { create: vi.fn(), update: vi.fn(), findUnique: vi.fn() },
    auditLog: { create: vi.fn() },
  },
  requirePermission: vi.fn(),
  revalidatePath: vi.fn(),
}));
vi.mock("@/server/db", () => ({ db: dbMock }));
vi.mock("@/features/auth", () => ({ requirePermission }));
vi.mock("next/cache", () => ({ revalidatePath }));

vi.mock("next/navigation", () => ({ redirect, forbidden: vi.fn() }));

import { createBranch, deleteBranch, updateBranch } from "@/features/branches/actions";
import { AUDIT_ACTIONS } from "@/constants/audit-actions";

const BASE = "/dashboard/super-admin/branches";

function formData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

beforeEach(() => {
  requirePermission.mockResolvedValue({ id: "actor-1" });
  dbMock.branch.create.mockResolvedValue({ id: "b1" });
  dbMock.branch.update.mockResolvedValue({ id: "b1" });
  dbMock.auditLog.create.mockResolvedValue({});
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("createBranch", () => {
  it("redirects back to the form with ?error=name when name is blank", async () => {
    const target = await captureRedirect(() => createBranch(formData({ name: "   " })));
    expect(target).toBe(`${BASE}/new?error=name`);
    expect(dbMock.branch.create).not.toHaveBeenCalled();
  });

  it("persists trimmed fields, coerces empties to null, and writes an audit log", async () => {
    const target = await captureRedirect(() =>
      createBranch(
        formData({
          name: "  Ulaanbaatar HQ  ",
          phone: "",
          city: " UB ",
          latitude: "47.92",
          longitude: "not-a-number",
          isActive: "on",
        }),
      ),
    );

    expect(dbMock.branch.create).toHaveBeenCalledTimes(1);
    const data = dbMock.branch.create.mock.calls[0][0].data;
    expect(data.name).toBe("Ulaanbaatar HQ");
    expect(data.phone).toBeNull(); // empty -> null
    expect(data.city).toBe("UB"); // trimmed
    expect(data.latitude).toBe("47.92"); // valid decimal kept
    expect(data.longitude).toBeNull(); // non-finite dropped
    expect(data.isActive).toBe(true); // checkbox "on"

    expect(dbMock.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ action: AUDIT_ACTIONS.BRANCH_CREATED }),
      }),
    );
    expect(revalidatePath).toHaveBeenCalledWith(BASE);
    expect(target).toBe(BASE);
  });

  it("treats a missing isActive checkbox as false", async () => {
    await captureRedirect(() => createBranch(formData({ name: "X" })));
    expect(dbMock.branch.create.mock.calls[0][0].data.isActive).toBe(false);
  });
});

describe("updateBranch", () => {
  it("redirects to the edit form with ?error=name when name is blank", async () => {
    const target = await captureRedirect(() => updateBranch("b1", formData({ name: "" })));
    expect(target).toBe(`${BASE}/b1?error=name`);
    expect(dbMock.branch.update).not.toHaveBeenCalled();
  });

  it("redirects to the list (no update) when the record is gone", async () => {
    dbMock.branch.findUnique.mockResolvedValue(null);
    const target = await captureRedirect(() =>
      updateBranch("missing", formData({ name: "Valid" })),
    );
    expect(target).toBe(BASE);
    expect(dbMock.branch.update).not.toHaveBeenCalled();
  });

  it("updates an existing branch and audits before/after", async () => {
    dbMock.branch.findUnique.mockResolvedValue({ id: "b1", name: "Old" });
    await captureRedirect(() => updateBranch("b1", formData({ name: "New" })));

    expect(dbMock.branch.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "b1" } }),
    );
    expect(dbMock.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ action: AUDIT_ACTIONS.BRANCH_UPDATED }),
      }),
    );
  });
});

describe("deleteBranch", () => {
  it("soft-deletes (isActive: false) rather than removing the row", async () => {
    dbMock.branch.findUnique.mockResolvedValue({ id: "b1", name: "X", isActive: true });
    await captureRedirect(() => deleteBranch("b1"));

    expect(dbMock.branch.update).toHaveBeenCalledWith({
      where: { id: "b1" },
      data: { isActive: false },
    });
  });

  it("is a no-op redirect when the branch does not exist", async () => {
    dbMock.branch.findUnique.mockResolvedValue(null);
    const target = await captureRedirect(() => deleteBranch("missing"));
    expect(target).toBe(BASE);
    expect(dbMock.branch.update).not.toHaveBeenCalled();
  });
});
