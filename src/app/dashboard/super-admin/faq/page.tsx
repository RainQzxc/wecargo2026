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

const BASE = "/dashboard/super-admin/faq";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await requirePermission(PERMISSIONS.FAQ_READ);
  const sp = await searchParams;
  const q = firstParam(sp.q);
  const { page, skip, take } = getPageParams(sp.page);
  const canCreate = await can(PERMISSIONS.FAQ_CREATE);

  const where: Prisma.FaqWhereInput = q
    ? {
        OR: [
          { questionMn: { contains: q, mode: "insensitive" } },
          { questionEn: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const [total, rows] = await Promise.all([
    db.faq.count({ where }),
    db.faq.findMany({ where, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], skip, take }),
  ]);
  const totalPages = getTotalPages(total, DEFAULT_PAGE_SIZE);

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("page", String(p));
    return `${BASE}?${params.toString()}`;
  };

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>FAQ</h1>
        {canCreate ? <Link href={`${BASE}/new`}>+ New FAQ</Link> : null}
      </div>

      <form method="get" style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <input type="search" name="q" defaultValue={q} placeholder="Search question/category…" style={{ padding: 6 }} />
        <button type="submit">Filter</button>
      </form>

      <p style={{ fontSize: 12, color: "#666" }}>{total} FAQ(s)</p>

      <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
            <th style={{ padding: 6, width: 50 }}>#</th>
            <th style={{ padding: 6 }}>Question (MN)</th>
            <th style={{ padding: 6 }}>Category</th>
            <th style={{ padding: 6 }}>Status</th>
            <th style={{ padding: 6 }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: 12, color: "#999" }}>
                No FAQs found.
              </td>
            </tr>
          ) : (
            rows.map((f) => (
              <tr key={f.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: 6, color: "#999" }}>{f.sortOrder}</td>
                <td style={{ padding: 6 }}>{f.questionMn}</td>
                <td style={{ padding: 6 }}>{f.category ?? "—"}</td>
                <td style={{ padding: 6, color: f.isActive ? "#137333" : "#999" }}>
                  {f.isActive ? "Active" : "Hidden"}
                </td>
                <td style={{ padding: 6 }}>
                  <Link href={`${BASE}/${f.id}`}>Edit</Link>
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
        {page < totalPages ? <Link href={pageHref(page + 1)}>Next →</Link> : <span style={{ color: "#ccc" }}>Next →</span>}
      </div>
    </section>
  );
}
