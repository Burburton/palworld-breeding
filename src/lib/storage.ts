const STORAGE_KEY = "palworld-owned-pals-v1";

function getStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readOwnedPals(): string[] {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is string => typeof value === "string");
  } catch {
    return [];
  }
}

export function writeOwnedPals(keys: readonly string[]): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify([...keys]));
  } catch {
    // ignore quota / unavailable storage
  }
}

export const OWNED_PALS_STORAGE_KEY = STORAGE_KEY;