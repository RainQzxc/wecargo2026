import { describe, expect, it } from "vitest";
import { normalizePhone } from "@/lib/phone";

describe("normalizePhone", () => {
  it("strips surrounding whitespace", () => {
    expect(normalizePhone("  99112233  ")).toBe("99112233");
  });

  it("removes internal spaces", () => {
    expect(normalizePhone("9911 2233")).toBe("99112233");
  });

  it("removes dashes", () => {
    expect(normalizePhone("9911-2233")).toBe("99112233");
  });

  it("removes a mix of spaces and dashes", () => {
    expect(normalizePhone(" 9911 - 22 - 33 ")).toBe("99112233");
  });

  it("leaves a country-code prefix intact", () => {
    expect(normalizePhone("+976 9911 2233")).toBe("+97699112233");
  });
});
