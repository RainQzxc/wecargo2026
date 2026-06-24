import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { db } from "@/server/db";
import {
  getPageParams,
  getTotalPages,
  firstParam,
  DEFAULT_PAGE_SIZE,
} from "@/lib/pagination";

/**
 * Shared branch list (search + pagination). Rendered by both the SUPER_ADMIN
 * management page (manageable) and the ADMIN read-only view. `basePath` drives
 * the search form target, pagination links and (when manageable) edit links.
 */
export async function BranchList({
  basePath,
  searchParams,
  manageable,
}: {
  basePath: string;
  searchParams: { q?: string; city?: string; page?: string };
  manageable: boolean;
}) {
  const q = firstParam(searchParams.q);
  const city = firstParam(searchParams.city);
  const { page, skip, take } = getPageParams(searchParams.page);

  const where: Prisma.BranchWhereInput = {
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { address: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
  };

  const [total, rows] = await Promise.all([
    db.branch.count({ where }),
    db.branch.findMany({
      where,
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
      skip,
      take,
    }),
  ]);
  const totalPages = getTotalPages(total, DEFAULT_PAGE_SIZE);

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (city) params.set("city", city);
    params.set("page", String(p));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div>
      <form method="get" style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <input type="search" name="q" defaultValue={q} placeholder="Search name/phone/address…" style={{ padding: 6 }} />
        <input type="search" name="city" defaultValue={city} placeholder="City…" style={{ padding: 6 }} />
        <button type="submit">Filter</button>
      </form>

      <p style={{ fontSize: 12, color: "#666" }}>{total} branch(es)</p>

      <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
            <th style={{ padding: 6 }}>Name</th>
            <th style={{ padding: 6 }}>Phone</th>
            <th style={{ padding: 6 }}>City</th>
            <th style={{ padding: 6 }}>Map</th>
            <th style={{ padding: 6 }}>Status</th>
            {manageable ? <th style={{ padding: 6 }}></th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={manageable ? 6 : 5} style={{ padding: 12, color: "#999" }}>
                No branches found.
              </td>
            </tr>
          ) : (
            rows.map((b) => (
              <tr key={b.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: 6 }}>{b.name}</td>
                <td style={{ padding: 6 }}>{b.phone ?? "—"}</td>
                <td style={{ padding: 6 }}>{b.city ?? "—"}</td>
                <td style={{ padding: 6 }}>
                  {b.latitude && b.longitude ? `${b.latitude}, ${b.longitude}` : "—"}
                </td>
                <td style={{ padding: 6, color: b.isActive ? "#137333" : "#999" }}>
                  {b.isActive ? "Active" : "Inactive"}
                </td>
                {manageable ? (
                  <td style={{ padding: 6 }}>
                    <Link href={`${basePath}/${b.id}`}>Edit</Link>
                  </td>
                ) : null}
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
    </div>
  );
}
