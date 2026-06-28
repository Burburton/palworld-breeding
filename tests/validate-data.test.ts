import { describe, expect, it } from "vitest";
import type { BreedingRule, Pal } from "../src/types/pal";
import { normalizePair, validateData } from "../scripts/validate-data";

const validPals: Pal[] = [
  { id: 1, key: "lamball", number: "001", nameZh: "棉棉羊", nameEn: "Lamball" },
  { id: 2, key: "cattiva", number: "002", nameZh: "捣蛋猫", nameEn: "Cattiva" },
  { id: 3, key: "chikipi", number: "003", nameZh: "皮皮鸡", nameEn: "Chikipi" },
];

const validRules: BreedingRule[] = [
  { parent1: "lamball", parent2: "cattiva", child: "chikipi" },
];

const validMetadata = {
  gameVersion: "1.0",
  dataVersion: "demo",
  lastUpdated: "2026-06-28",
  sourceDescription: "test",
};

describe("normalizePair", () => {
  it("sorts pair members alphabetically", () => {
    expect(normalizePair("b", "a")).toBe("a::b");
    expect(normalizePair("a", "b")).toBe("a::b");
  });

  it("treats A+B and B+A as the same key", () => {
    expect(normalizePair("penking", "bushi")).toBe(
      normalizePair("bushi", "penking")
    );
  });
});

describe("validateData", () => {
  it("passes on clean data", () => {
    const result = validateData(validPals, validRules, validMetadata);
    expect(result.errors).toEqual([]);
    expect(result.pals).toBe(3);
    expect(result.breedingRules).toBe(1);
    expect(result.invalidParentIds).toBe(0);
    expect(result.invalidChildIds).toBe(0);
    expect(result.duplicateRules).toBe(0);
  });

  it("flags duplicate pal keys", () => {
    const pals: Pal[] = [
      ...validPals,
      { id: 99, key: "lamball", number: "099", nameZh: "重复", nameEn: "Dup" },
    ];
    const result = validateData(pals, validRules, validMetadata);
    expect(result.errors.some((e) => e.includes("Duplicate pal key"))).toBe(
      true
    );
  });

  it("flags duplicate pal ids", () => {
    const pals: Pal[] = [
      ...validPals,
      { id: 1, key: "extra", number: "099", nameZh: "重复", nameEn: "Dup" },
    ];
    const result = validateData(pals, validRules, validMetadata);
    expect(result.errors.some((e) => e.includes("Duplicate pal id"))).toBe(
      true
    );
  });

  it("flags invalid parent1 reference", () => {
    const rules: BreedingRule[] = [
      { parent1: "ghost", parent2: "cattiva", child: "chikipi" },
    ];
    const result = validateData(validPals, rules, validMetadata);
    expect(result.invalidParentIds).toBe(1);
    expect(result.errors.some((e) => e.includes("unknown parent1"))).toBe(
      true
    );
  });

  it("flags invalid parent2 reference", () => {
    const rules: BreedingRule[] = [
      { parent1: "lamball", parent2: "ghost", child: "chikipi" },
    ];
    const result = validateData(validPals, rules, validMetadata);
    expect(result.invalidParentIds).toBe(1);
    expect(result.errors.some((e) => e.includes("unknown parent2"))).toBe(
      true
    );
  });

  it("flags invalid child reference", () => {
    const rules: BreedingRule[] = [
      { parent1: "lamball", parent2: "cattiva", child: "ghost" },
    ];
    const result = validateData(validPals, rules, validMetadata);
    expect(result.invalidChildIds).toBe(1);
    expect(result.errors.some((e) => e.includes("unknown child"))).toBe(true);
  });

  it("treats A+B and B+A as duplicates", () => {
    const rules: BreedingRule[] = [
      { parent1: "lamball", parent2: "cattiva", child: "chikipi" },
      { parent1: "cattiva", parent2: "lamball", child: "chikipi" },
    ];
    const result = validateData(validPals, rules, validMetadata);
    expect(result.duplicateRules).toBe(1);
    expect(result.errors.some((e) => e.includes("Duplicate breeding pair"))).toBe(
      true
    );
  });

  it("rejects non-array pals input", () => {
    const result = validateData({}, validRules, validMetadata);
    expect(result.errors.some((e) => e.includes("pals.json"))).toBe(true);
  });

  it("rejects non-array breeding input", () => {
    const result = validateData(validPals, {}, validMetadata);
    expect(result.errors.some((e) => e.includes("breeding.json"))).toBe(
      true
    );
  });
});