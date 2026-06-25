import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseHref: string;
  searchParams?: Record<string, string>;
}

export function Pagination({
  currentPage,
  totalPages,
  baseHref,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  function buildHref(page: number): string {
    const params = new URLSearchParams({ ...searchParams, page: String(page) });
    return `${baseHref}?${params.toString()}`;
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="flex items-center gap-3">
      {hasPrev ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="border border-neutral-200 rounded-lg px-3 py-1.5 text-sm text-ink-3 hover:bg-neutral-50"
        >
          Өмнөх
        </Link>
      ) : (
        <span className="border border-neutral-200 rounded-lg px-3 py-1.5 text-sm text-ink-3 opacity-40 cursor-not-allowed">
          Өмнөх
        </span>
      )}

      <span className="text-sm text-ink-3">
        Хуудас {currentPage} / {totalPages}
      </span>

      {hasNext ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="border border-neutral-200 rounded-lg px-3 py-1.5 text-sm text-ink-3 hover:bg-neutral-50"
        >
          Дараах
        </Link>
      ) : (
        <span className="border border-neutral-200 rounded-lg px-3 py-1.5 text-sm text-ink-3 opacity-40 cursor-not-allowed">
          Дараах
        </span>
      )}
    </div>
  );
}
