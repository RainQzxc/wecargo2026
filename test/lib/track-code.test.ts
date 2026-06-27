import { describe, expect, it } from "vitest";
import { isValidTrackCode, normalizeTrackCode } from "@/lib/track-code";

describe("normalizeTrackCode", () => {
  it("uppercases and trims", () => {
    expect(normalizeTrackCode("  ab12cd34  ")).toBe("AB12CD34");
  });

  it("strips all internal whitespace", () => {
    expect(normalizeTrackCode("ab 12\tcd\n34")).toBe("AB12CD34");
  });
});

describe("isValidTrackCode", () => {
  it("accepts codes of 8 characters (lower boundary)", () => {
    expect(isValidTrackCode("ABCD1234")).toBe(true);
  });

  it("accepts codes of 40 characters (upper boundary)", () => {
    expect(isValidTrackCode("A".repeat(40))).toBe(true);
  });

  it("rejects codes shorter than 8 after normalization", () => {
    expect(isValidTrackCode("ABC123")).toBe(false);
    expect(isValidTrackCode("  AB 12  ")).toBe(false);
  });

  it("rejects codes longer than 40", () => {
    expect(isValidTrackCode("A".repeat(41))).toBe(false);
  });

  it("counts length after whitespace is stripped", () => {
    // 8 meaningful chars with spaces should still validate
    expect(isValidTrackCode("AB CD 12 34")).toBe(true);
  });
});
