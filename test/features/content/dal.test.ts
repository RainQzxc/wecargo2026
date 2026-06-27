import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { dbMock } = vi.hoisted(() => ({
  dbMock: {
    testimonial: { findMany: vi.fn() },
    faq: { findMany: vi.fn() },
    siteContent: { findMany: vi.fn() },
  },
}));
vi.mock("@/server/db", () => ({ db: dbMock }));
// unstable_cache just wraps the fetcher; we test the raw fetchers, but the
// module imports it at load time, so provide a pass-through.
vi.mock("next/cache", () => ({
  unstable_cache: (fn: unknown) => fn,
}));

import {
  fetchActiveFaqs,
  fetchActiveTestimonials,
  fetchSiteContent,
  toInitials,
} from "@/features/content/dal";

afterEach(() => vi.clearAllMocks());

describe("toInitials", () => {
  it("takes the first letters of the first two name parts", () => {
    expect(toInitials("Б. Энхжин")).toBe("БЭ");
    expect(toInitials("Г. Мөнх-Оргил")).toBe("ГМ");
  });

  it("handles a single-word name", () => {
    expect(toInitials("Номин")).toBe("Н");
  });

  it("falls back to a bullet for an empty name", () => {
    expect(toInitials("   ")).toBe("•");
  });
});

describe("fetchActiveTestimonials", () => {
  beforeEach(() => {
    dbMock.testimonial.findMany.mockResolvedValue([
      { id: "t1", quoteMn: "Сайхан", authorName: "Б. Энхжин", authorRole: "Худалдаа" },
      { id: "t2", quoteMn: "Хурдан", authorName: "Номин", authorRole: null },
    ]);
  });

  it("queries only active rows ordered by sortOrder then recency", async () => {
    await fetchActiveTestimonials();
    expect(dbMock.testimonial.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  });

  it("maps DB rows to the view shape with derived initials", async () => {
    const result = await fetchActiveTestimonials();
    expect(result[0]).toEqual({
      id: "t1",
      quote: "Сайхан",
      name: "Б. Энхжин",
      role: "Худалдаа",
      initials: "БЭ",
    });
    expect(result[1].role).toBe(""); // null role coerced to ""
  });

  it("returns [] (no throw) when the DB errors", async () => {
    dbMock.testimonial.findMany.mockRejectedValue(new Error("db down"));
    await expect(fetchActiveTestimonials()).resolves.toEqual([]);
  });
});

describe("fetchActiveFaqs", () => {
  it("maps Mongolian question/answer fields and returns them ordered", async () => {
    dbMock.faq.findMany.mockResolvedValue([
      { id: "f1", questionMn: "Тариф?", answerMn: "Жингээр." },
    ]);
    const result = await fetchActiveFaqs();
    expect(dbMock.faq.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    expect(result).toEqual([{ id: "f1", question: "Тариф?", answer: "Жингээр." }]);
  });

  it("returns [] (no throw) when the DB errors", async () => {
    dbMock.faq.findMany.mockRejectedValue(new Error("db down"));
    await expect(fetchActiveFaqs()).resolves.toEqual([]);
  });
});

describe("fetchSiteContent", () => {
  it("builds a key -> valueMn map and skips empty values", async () => {
    dbMock.siteContent.findMany.mockResolvedValue([
      { key: "home.hero.badge", valueMn: "Шинэ" },
      { key: "home.hero.titleLine1", valueMn: "" }, // empty skipped
    ]);
    await expect(fetchSiteContent()).resolves.toEqual({ "home.hero.badge": "Шинэ" });
  });

  it("returns {} (no throw) when the DB errors", async () => {
    dbMock.siteContent.findMany.mockRejectedValue(new Error("db down"));
    await expect(fetchSiteContent()).resolves.toEqual({});
  });
});
