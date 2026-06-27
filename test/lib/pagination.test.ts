import { describe, expect, it } from "vitest";
import {
  DEFAULT_PAGE_SIZE,
  firstParam,
  getPageParams,
  getTotalPages,
} from "@/lib/pagination";

describe("getPageParams", () => {
  it("defaults to page 1 when param is undefined", () => {
    expect(getPageParams(undefined)).toEqual({
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      skip: 0,
      take: DEFAULT_PAGE_SIZE,
    });
  });

  it("parses a valid page number and computes skip", () => {
    expect(getPageParams("3")).toEqual({
      page: 3,
      pageSize: DEFAULT_PAGE_SIZE,
      skip: 2 * DEFAULT_PAGE_SIZE,
      take: DEFAULT_PAGE_SIZE,
    });
  });

  it("falls back to page 1 for non-numeric input", () => {
    expect(getPageParams("abc").page).toBe(1);
  });

  it("falls back to page 1 for zero and negative pages", () => {
    expect(getPageParams("0").page).toBe(1);
    expect(getPageParams("-5").page).toBe(1);
  });

  it("uses the first value of an array param", () => {
    expect(getPageParams(["2", "9"]).page).toBe(2);
  });

  it("respects a custom page size", () => {
    expect(getPageParams("2", 50)).toEqual({
      page: 2,
      pageSize: 50,
      skip: 50,
      take: 50,
    });
  });
});

describe("getTotalPages", () => {
  it("returns at least 1 even with zero rows", () => {
    expect(getTotalPages(0)).toBe(1);
  });

  it("rounds up partial pages", () => {
    expect(getTotalPages(21, 20)).toBe(2);
    expect(getTotalPages(41, 20)).toBe(3);
  });

  it("handles exact multiples without an extra page", () => {
    expect(getTotalPages(40, 20)).toBe(2);
  });
});

describe("firstParam", () => {
  it("trims a string param", () => {
    expect(firstParam("  hello  ")).toBe("hello");
  });

  it("returns the first array entry, trimmed", () => {
    expect(firstParam([" a ", "b"])).toBe("a");
  });

  it("returns empty string for undefined", () => {
    expect(firstParam(undefined)).toBe("");
  });
});
