export const DEFAULT_PAGE_SIZE = 20;

export interface PageParams {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
}

/** Coerce a raw `?page=` search param into safe pagination math. 1-based. */
export function getPageParams(
  rawPage: string | string[] | undefined,
  pageSize: number = DEFAULT_PAGE_SIZE,
): PageParams {
  const n = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const parsed = Number.parseInt(n ?? "1", 10);
  const page = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}

export function getTotalPages(total: number, pageSize: number = DEFAULT_PAGE_SIZE): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

/** First value of a possibly-array search param, trimmed. */
export function firstParam(v: string | string[] | undefined): string {
  const s = Array.isArray(v) ? v[0] : v;
  return (s ?? "").trim();
}
