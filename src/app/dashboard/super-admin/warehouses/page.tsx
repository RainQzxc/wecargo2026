import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { requirePermission } from "@/features/auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { can } from "@/features/auth/dal";
import { db } from "@/server/db";
import {
  getPageParams,
  getTotalPages,
  firstParam,
  DEFAULT_PAGE_SIZE,
} from "@/lib/pagination";

const BASE = "/dashboard/super-admin/warehouses";

const TYPE_LABELS: Record<string, string> = {
  EREEN: "Эрээн",
  ULAANBAATAR: "Улаанбаатар",
  OTHER: "Бусад",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
}) {
  await requirePermission(PERMISSIONS.WAREHOUSES_READ);
  const sp = await searchParams;
  const q = firstParam(sp.q);
  const type = firstParam(sp.type);
  const { page, skip, take } = getPageParams(sp.page);
  const canCreate = await can(PERMISSIONS.WAREHOUSES_CREATE);

  const where: Prisma.WarehouseWhereInput = {
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(type === "EREEN" || type === "ULAANBAATAR" || type === "OTHER"
      ? { type }
      : {}),
  };

  const [total, rows] = await Promise.all([
    db.warehouse.count({ where }),
    db.warehouse.findMany({
      where,
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
      skip,
      take,
    }),
  ]);
  const totalPages = getTotalPages(total, DEFAULT_PAGE_SIZE);

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type) params.set("type", type);
    params.set("page", String(p));
    return `${BASE}?${params.toString()}`;
  };

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Warehouses</h1>
        {canCreate ? (
          <Link href={`${BASE}/new`}>+ New warehouse</Link>
        ) : null}
      </div>

      <form method="get" style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search name or phone…"
          style={{ padding: 6 }}
        />
        <select name="type" defaultValue={type} style={{ padding: 6 }}>
          <option value="">All types</option>
          <option value="EREEN">Эрээн</option>
          <option value="ULAANBAATAR">Улаанбаатар</option>
          <option value="OTHER">Бусад</option>
        </select>
        <button type="submit">Filter</button>
      </form>

      <p style={{ fontSize: 12, color: "#666" }}>{total} warehouse(s)</p>

      <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
            <th style={{ padding: 6 }}>Name</th>
            <th style={{ padding: 6 }}>Type</th>
            <th style={{ padding: 6 }}>Phone</th>
            <th style={{ padding: 6 }}>Status</th>
            <th style={{ padding: 6 }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: 12, color: "#999" }}>
                No warehouses found.
              </td>
            </tr>
          ) : (
            rows.map((w) => (
              <tr key={w.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: 6 }}>{w.name}</td>
                <td style={{ padding: 6 }}>{TYPE_LABELS[w.type] ?? w.type}</td>
                <td style={{ padding: 6 }}>{w.phone ?? "—"}</td>
                <td style={{ padding: 6, color: w.isActive ? "#137333" : "#999" }}>
                  {w.isActive ? "Active" : "Inactive"}
                </td>
                <td style={{ padding: 6 }}>
                  <Link href={`${BASE}/${w.id}`}>Edit</Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{ display: "flex", gap: 12, marginTop: 12, alignItems: "center" }}>
        {page > 1 ? <Link href={pageHref(page - 1)}>← Prev</Link> : <span style={{ color: "#ccc" }}>← Prev</span>}
        <span style={{ fontSize: 12, color: "#666" }}>
          Page {page} / {totalPages}
        </span>
        {page < totalPages ? (
          <Link href={pageHref(page + 1)}>Next →</Link>
        ) : (
          <span style={{ color: "#ccc" }}>Next →</span>
        )}
      </div>
    </section>
  );
}
