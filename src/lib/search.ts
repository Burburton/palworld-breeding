import type { Pal } from "../types/pal.ts";

export function normalizeSearchText(value: string): string {
  return value.trim().toLowerCase();
}

export function searchPals(
  pals: readonly Pal[],
  query: string,
  limit = 10
): Pal[] {
  const trimmed = query.trim();
  const normalized = normalizeSearchText(query);

  if (!normalized) {
    return [];
  }

  const matches: Pal[] = [];
  for (const pal of pals) {
    if (
      pal.nameZh.includes(trimmed) ||
      pal.nameEn.toLowerCase().includes(normalized) ||
      pal.number.toLowerCase().includes(normalized)
    ) {
      matches.push(pal);
      if (matches.length >= limit) {
        break;
      }
    }
  }
  return matches;
}