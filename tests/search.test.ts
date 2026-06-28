import { describe, expect, it } from "vitest";
import type { Pal } from "../src/types/pal";
import { normalizeSearchText, searchPals } from "../src/lib/search";

const samplePals: Pal[] = [
  { id: 1, key: "lamball", number: "001", nameZh: "棉棉羊", nameEn: "Lamball" },
  { id: 2, key: "cattiva", number: "002", nameZh: "捣蛋猫", nameEn: "Cattiva" },
  { id: 3, key: "chikipi", number: "003", nameZh: "皮皮鸡", nameEn: "Chikipi" },
  { id: 100, key: "anubis", number: "100", nameZh: "阿努比斯", nameEn: "Anubis" },
];

describe("normalizeSearchText", () => {
  it("trims and lowercases", () => {
    expect(normalizeSearchText("  HELLO  ")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(normalizeSearchText("")).toBe("");
  });

  it("handles all-whitespace input", () => {
    expect(normalizeSearchText("   ")).toBe("");
  });
});

describe("searchPals", () => {
  it("matches Chinese full name", () => {
    expect(searchPals(samplePals, "棉棉羊")).toEqual([samplePals[0]]);
  });

  it("matches Chinese partial name", () => {
    expect(searchPals(samplePals, "棉")).toEqual([samplePals[0]]);
  });

  it("matches English full name", () => {
    expect(searchPals(samplePals, "Anubis")).toEqual([samplePals[3]]);
  });

  it("matches English partial name", () => {
    expect(searchPals(samplePals, "lamb")).toEqual([samplePals[0]]);
  });

  it("is case-insensitive for English", () => {
    expect(searchPals(samplePals, "ANUBIS")).toEqual([samplePals[3]]);
    expect(searchPals(samplePals, "anubis")).toEqual([samplePals[3]]);
    expect(searchPals(samplePals, "AnUbIs")).toEqual([samplePals[3]]);
  });

  it("matches by number", () => {
    expect(searchPals(samplePals, "100")).toEqual([samplePals[3]]);
    expect(searchPals(samplePals, "003")).toEqual([samplePals[2]]);
  });

  it("returns empty array for empty query", () => {
    expect(searchPals(samplePals, "")).toEqual([]);
  });

  it("returns empty array for whitespace-only query", () => {
    expect(searchPals(samplePals, "   ")).toEqual([]);
  });

  it("returns empty array when no match", () => {
    expect(searchPals(samplePals, "zzz")).toEqual([]);
  });

  it("trims whitespace before searching", () => {
    expect(searchPals(samplePals, "  lamball  ")).toEqual([samplePals[0]]);
  });

  it("respects limit and defaults to 10", () => {
    const many: Pal[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      key: `pal-${i}`,
      number: String(i),
      nameZh: "帕鲁",
      nameEn: "Pal",
    }));
    expect(searchPals(many, "pal").length).toBe(10);
    expect(searchPals(many, "pal", 5).length).toBe(5);
  });
});