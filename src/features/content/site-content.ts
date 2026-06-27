/**
 * Registry of editable marketing copy. Each entry maps a stable `key` (stored
 * in the SiteContent table) to its built-in default and editor metadata.
 *
 * This module is framework-neutral (no server-only imports) so it can be shared
 * by client components (for defaults/types) and by the server (DAL + editor).
 * The headline is intentionally split into three fields so the public hero can
 * keep its styling (highlighted middle line) while staying editable.
 */

export interface SiteContentField {
  key: string;
  /** Mongolian label shown in the admin editor. */
  label: string;
  /** Built-in fallback used when the key is unset (or the DB is unreachable). */
  default: string;
  /** Render a textarea instead of a single-line input. */
  multiline?: boolean;
  /** Grouping heading in the editor. */
  group: string;
}

export const SITE_CONTENT_FIELDS: SiteContentField[] = [
  { key: "home.hero.badge", group: "Нүүр — Hero", label: "Тэмдэг (badge)", default: "Монголын ухаалаг карго" },
  { key: "home.hero.titleLine1", group: "Нүүр — Hero", label: "Гарчиг — 1-р мөр", default: "Эрээнээс" },
  { key: "home.hero.titleHighlight", group: "Нүүр — Hero", label: "Гарчиг — онцолсон үг", default: "Улаанбаатар" },
  { key: "home.hero.titleLine3", group: "Нүүр — Hero", label: "Гарчиг — 3-р мөр", default: "хүртэл тодорхой." },
  {
    key: "home.hero.description",
    group: "Нүүр — Hero",
    label: "Тайлбар",
    multiline: true,
    default: "Ачаагаа агуулахад хүлээн авахаас эхлээд гэрт хүргэх хүртэл нэг цонхоор хяна.",
  },
  { key: "home.hero.ctaPrimary", group: "Нүүр — Hero", label: "Үндсэн товч", default: "Линк захиалга өгөх" },
  { key: "home.hero.ctaSecondary", group: "Нүүр — Hero", label: "Хоёрдогч товч", default: "Хамтран ажиллах" },
];

/** Full default map (key -> default value). */
export const SITE_CONTENT_DEFAULTS: Record<string, string> = Object.fromEntries(
  SITE_CONTENT_FIELDS.map((f) => [f.key, f.default]),
);

/** The set of keys the editor manages — used to filter/validate writes. */
export const SITE_CONTENT_KEYS = new Set(SITE_CONTENT_FIELDS.map((f) => f.key));

/**
 * Merge stored overrides on top of the defaults. Unknown keys in `overrides`
 * are ignored; missing keys fall back to their default. Always returns a value
 * for every registered key.
 */
export function resolveSiteContent(overrides: Record<string, string> = {}): Record<string, string> {
  const resolved: Record<string, string> = { ...SITE_CONTENT_DEFAULTS };
  for (const key of SITE_CONTENT_KEYS) {
    const v = overrides[key];
    if (typeof v === "string" && v.trim().length > 0) resolved[key] = v;
  }
  return resolved;
}
