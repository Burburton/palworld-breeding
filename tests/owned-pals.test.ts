import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  OWNED_PALS_STORAGE_KEY,
  readOwnedPals,
  writeOwnedPals,
} from "../src/lib/storage";
import { useOwnedPals } from "../src/hooks/useOwnedPals";

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  window.localStorage.clear();
});

describe("storage", () => {
  it("writes and reads owned pal keys", () => {
    writeOwnedPals(["a", "b"]);
    expect(readOwnedPals()).toEqual(["a", "b"]);
  });

  it("returns empty array when storage missing key", () => {
    expect(readOwnedPals()).toEqual([]);
  });

  it("falls back to empty array on corrupted JSON", () => {
    window.localStorage.setItem(OWNED_PALS_STORAGE_KEY, "{not-json");
    expect(readOwnedPals()).toEqual([]);
  });

  it("falls back to empty array when JSON is not an array", () => {
    window.localStorage.setItem(OWNED_PALS_STORAGE_KEY, JSON.stringify({ a: 1 }));
    expect(readOwnedPals()).toEqual([]);
  });

  it("filters non-string entries", () => {
    window.localStorage.setItem(
      OWNED_PALS_STORAGE_KEY,
      JSON.stringify(["a", 1, null, "b"])
    );
    expect(readOwnedPals()).toEqual(["a", "b"]);
  });

  it("swallows storage write errors", () => {
    const setItem = vi.fn(() => {
      throw new Error("quota");
    });
    const original = window.localStorage.setItem;
    window.localStorage.setItem = setItem;
    expect(() => writeOwnedPals(["x"])).not.toThrow();
    window.localStorage.setItem = original;
  });
});

describe("useOwnedPals", () => {
  it("hydrates from storage on mount", () => {
    writeOwnedPals(["anubis", "penking"]);
    const { result } = renderHook(() => useOwnedPals());
    expect(result.current.ownedPals.has("anubis")).toBe(true);
    expect(result.current.ownedPals.has("penking")).toBe(true);
  });

  it("adds a pal and persists", () => {
    const { result } = renderHook(() => useOwnedPals());
    act(() => result.current.addOwnedPal("anubis"));
    expect(result.current.ownedPals.has("anubis")).toBe(true);
    expect(readOwnedPals()).toContain("anubis");
  });

  it("removes a pal and persists", () => {
    writeOwnedPals(["anubis"]);
    const { result } = renderHook(() => useOwnedPals());
    act(() => result.current.removeOwnedPal("anubis"));
    expect(result.current.ownedPals.has("anubis")).toBe(false);
    expect(readOwnedPals()).not.toContain("anubis");
  });

  it("toggles a pal", () => {
    const { result } = renderHook(() => useOwnedPals());
    act(() => result.current.toggleOwnedPal("anubis"));
    expect(result.current.ownedPals.has("anubis")).toBe(true);
    act(() => result.current.toggleOwnedPal("anubis"));
    expect(result.current.ownedPals.has("anubis")).toBe(false);
  });

  it("clears all owned pals", () => {
    writeOwnedPals(["a", "b"]);
    const { result } = renderHook(() => useOwnedPals());
    act(() => result.current.clearOwnedPals());
    expect(result.current.ownedPals.size).toBe(0);
    expect(readOwnedPals()).toEqual([]);
  });
});