import { useCallback, useEffect, useState } from "react";
import { readOwnedPals, writeOwnedPals } from "../lib/storage.ts";

export interface UseOwnedPalsResult {
  ownedPals: ReadonlySet<string>;
  addOwnedPal: (palKey: string) => void;
  removeOwnedPal: (palKey: string) => void;
  toggleOwnedPal: (palKey: string) => void;
  clearOwnedPals: () => void;
  hasOwnedPal: (palKey: string) => boolean;
}

export function useOwnedPals(): UseOwnedPalsResult {
  const [ownedPals, setOwnedPals] = useState<ReadonlySet<string>>(
    () => new Set(readOwnedPals())
  );

  useEffect(() => {
    writeOwnedPals([...ownedPals]);
  }, [ownedPals]);

  const addOwnedPal = useCallback((palKey: string) => {
    setOwnedPals((current) => {
      if (current.has(palKey)) return current;
      const next = new Set(current);
      next.add(palKey);
      return next;
    });
  }, []);

  const removeOwnedPal = useCallback((palKey: string) => {
    setOwnedPals((current) => {
      if (!current.has(palKey)) return current;
      const next = new Set(current);
      next.delete(palKey);
      return next;
    });
  }, []);

  const toggleOwnedPal = useCallback((palKey: string) => {
    setOwnedPals((current) => {
      const next = new Set(current);
      if (next.has(palKey)) {
        next.delete(palKey);
      } else {
        next.add(palKey);
      }
      return next;
    });
  }, []);

  const clearOwnedPals = useCallback(() => {
    setOwnedPals(new Set());
  }, []);

  const hasOwnedPal = useCallback(
    (palKey: string) => ownedPals.has(palKey),
    [ownedPals]
  );

  return {
    ownedPals,
    addOwnedPal,
    removeOwnedPal,
    toggleOwnedPal,
    clearOwnedPals,
    hasOwnedPal,
  };
}