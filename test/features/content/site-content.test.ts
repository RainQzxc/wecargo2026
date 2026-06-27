import { describe, expect, it } from "vitest";
import {
  SITE_CONTENT_DEFAULTS,
  SITE_CONTENT_FIELDS,
  resolveSiteContent,
} from "@/features/content/site-content";

describe("site-content registry", () => {
  it("has a default for every field and matching defaults map", () => {
    for (const field of SITE_CONTENT_FIELDS) {
      expect(field.default.length).toBeGreaterThan(0);
      expect(SITE_CONTENT_DEFAULTS[field.key]).toBe(field.default);
    }
  });

  it("uses unique keys", () => {
    const keys = SITE_CONTENT_FIELDS.map((f) => f.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("resolveSiteContent", () => {
  it("returns all defaults when given no overrides", () => {
    expect(resolveSiteContent()).toEqual(SITE_CONTENT_DEFAULTS);
  });

  it("applies a valid override", () => {
    const resolved = resolveSiteContent({ "home.hero.badge": "Шинэ badge" });
    expect(resolved["home.hero.badge"]).toBe("Шинэ badge");
    // other keys keep defaults
    expect(resolved["home.hero.titleLine1"]).toBe(SITE_CONTENT_DEFAULTS["home.hero.titleLine1"]);
  });

  it("ignores empty / whitespace overrides (falls back to default)", () => {
    const resolved = resolveSiteContent({ "home.hero.badge": "   " });
    expect(resolved["home.hero.badge"]).toBe(SITE_CONTENT_DEFAULTS["home.hero.badge"]);
  });

  it("ignores unknown keys", () => {
    const resolved = resolveSiteContent({ "not.a.real.key": "x" });
    expect(resolved).not.toHaveProperty("not.a.real.key");
    expect(resolved).toEqual(SITE_CONTENT_DEFAULTS);
  });

  it("always returns a value for every registered key", () => {
    const resolved = resolveSiteContent({});
    for (const field of SITE_CONTENT_FIELDS) {
      expect(typeof resolved[field.key]).toBe("string");
      expect(resolved[field.key].length).toBeGreaterThan(0);
    }
  });
});
