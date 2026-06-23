export function normalizeTrackCode(raw: string): string {
  return raw.trim().replace(/\s+/g, "").toUpperCase();
}

export function isValidTrackCode(raw: string): boolean {
  const normalized = normalizeTrackCode(raw);
  return normalized.length >= 8 && normalized.length <= 40;
}
