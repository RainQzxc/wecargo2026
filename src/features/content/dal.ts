import "server-only";

import { unstable_cache } from "next/cache";
import { db } from "@/server/db";
import { logger } from "@/lib/logger";

/**
 * Public landing-page content, sourced from the same models the super-admin
 * dashboard manages (Testimonial, Faq). The marketing pages were previously
 * hardcoded and ignored these tables; this DAL connects them.
 *
 * Design:
 * - Reads are wrapped in `unstable_cache` with a tag so the page renders like
 *   static content, and admin edits invalidate it via `revalidateTag` (see the
 *   testimonials/faq server actions). A time-based `revalidate` is a safety net.
 * - Fetchers never throw: on a DB error they log and return `[]`, so a database
 *   hiccup degrades to the components' built-in fallback copy rather than a
 *   broken landing page.
 */

/** Cache tags — server actions call `revalidateTag` with these after a write. */
export const CONTENT_CACHE_TAGS = {
  testimonials: "content:testimonials",
  faqs: "content:faqs",
} as const;

const REVALIDATE_SECONDS = 300;

export interface TestimonialView {
  id: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export interface FaqView {
  id: string;
  question: string;
  answer: string;
}

/** Derive up-to-two-letter initials from a display name (e.g. "Б. Энхжин" → "БЭ"). */
export function toInitials(name: string): string {
  const letters = name
    .trim()
    .split(/\s+/)
    .map((part) => part.replace(/[.\-]/g, ""))
    .filter(Boolean)
    .map((part) => [...part][0]);
  const initials = `${letters[0] ?? ""}${letters[1] ?? ""}`.toUpperCase();
  return initials || "•";
}

/** Uncached fetch + mapping. Exported for unit testing; pages use the cached form. */
export async function fetchActiveTestimonials(): Promise<TestimonialView[]> {
  try {
    const rows = await db.testimonial.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return rows.map((t) => ({
      id: t.id,
      quote: t.quoteMn,
      name: t.authorName,
      role: t.authorRole ?? "",
      initials: toInitials(t.authorName),
    }));
  } catch (err) {
    logger.captureException("content.testimonials", err);
    return [];
  }
}

/** Uncached fetch + mapping. Exported for unit testing; pages use the cached form. */
export async function fetchActiveFaqs(): Promise<FaqView[]> {
  try {
    const rows = await db.faq.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return rows.map((f) => ({ id: f.id, question: f.questionMn, answer: f.answerMn }));
  } catch (err) {
    logger.captureException("content.faqs", err);
    return [];
  }
}

export const getActiveTestimonials = unstable_cache(
  fetchActiveTestimonials,
  ["content:testimonials"],
  { tags: [CONTENT_CACHE_TAGS.testimonials], revalidate: REVALIDATE_SECONDS },
);

export const getActiveFaqs = unstable_cache(fetchActiveFaqs, ["content:faqs"], {
  tags: [CONTENT_CACHE_TAGS.faqs],
  revalidate: REVALIDATE_SECONDS,
});
