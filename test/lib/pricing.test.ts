import { describe, expect, it } from "vitest";
import { calcVolumeM3 } from "@/lib/pricing";

describe("calcVolumeM3", () => {
  it("converts cubic centimeters to cubic meters", () => {
    // 100cm x 100cm x 100cm = 1m^3
    expect(calcVolumeM3(100, 100, 100)).toBe(1);
  });

  it("returns 0 when any dimension is 0", () => {
    expect(calcVolumeM3(0, 50, 50)).toBe(0);
    expect(calcVolumeM3(50, 0, 50)).toBe(0);
    expect(calcVolumeM3(50, 50, 0)).toBe(0);
  });

  it("handles small parcels below 1 m^3", () => {
    // 10 x 10 x 10 = 1000 cm^3 = 0.001 m^3
    expect(calcVolumeM3(10, 10, 10)).toBeCloseTo(0.001, 10);
  });

  it("handles non-cubic dimensions", () => {
    // 200 x 50 x 50 = 500000 cm^3 = 0.5 m^3
    expect(calcVolumeM3(200, 50, 50)).toBeCloseTo(0.5, 10);
  });
});
