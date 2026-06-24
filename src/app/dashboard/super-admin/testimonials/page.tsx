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

const BASE = "/dashboard/super-admin/testimonials";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await requirePermission(PERMISSIONS.TESTIMONIALS_READ);
  const sp = await searchParams;
  const q = firstParam(sp.q);
  const { page, skip, take } = getPageParams(sp.page);
  const canCreate = await can(PERMISSIONS.TESTIMONIALS_CREATE);

  const where: Prisma.TestimonialWhereInput = q
    ? {
        OR: [
          { authorName: { contains: q, mode: "insensitive" } },
          { authorRole: { contains: q, mode: "insensitive" } },
          { quoteMn: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const [total, rows] = await Promise.all([
    db.testimonial.count({ where }),
    db.testimonial.findMany({ where, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], skip, take }),
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
        <h1>Testimonials</h1>
        {canCreate ? <Link href={`${BASE}/new`}>+ New testimonial</Link> : null}
      </div>

      <form method="get" style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <input type="search" name="q" defaultValue={q} placeholder="Search author/quote…" style={{ padding: 6 }} />
        <button type="submit">Filter</button>
      </form>

      <p style={{ fontSize: 12, color: "#666" }}>{total} testimonial(s)</p>

      <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
            <th style={{ padding: 6, width: 50 }}>#</th>
            <th style={{ padding: 6 }}>Author</th>
            <th style={{ padding: 6 }}>Rating</th>
            <th style={{ padding: 6 }}>Status</th>
            <th style={{ padding: 6 }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: 12, color: "#999" }}>
                No testimonials found.
              </td>
            </tr>
          ) : (
            rows.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: 6, color: "#999" }}>{t.sortOrder}</td>
                <td style={{ padding: 6 }}>
                  {t.authorName}
                  {t.authorRole ? <span style={{ color: "#999" }}> · {t.authorRole}</span> : null}
                </td>
                <td style={{ padding: 6 }}>{t.rating ? "★".repeat(t.rating) : "—"}</td>
                <td style={{ padding: 6, color: t.isActive ? "#137333" : "#999" }}>
                  {t.isActive ? "Active" : "Hidden"}
                </td>
                <td style={{ padding: 6 }}>
                  <Link href={`${BASE}/${t.id}`}>Edit</Link>
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
