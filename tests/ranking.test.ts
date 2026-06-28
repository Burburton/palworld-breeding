import { describe, expect, it } from "vitest";
import type { BreedingCombination } from "../src/types/pal";
import {
  describeOwnership,
  rankCombinations,
  scoreCombination,
} from "../src/lib/ownership";

const a: BreedingCombination = { parent1: "a", parent2: "b" };
const c: BreedingCombination = { parent1: "c", parent2: "d" };
const e: BreedingCombination = { parent1: "e", parent2: "f" };

describe("describeOwnership", () => {
  it("returns 'both' when both parents are owned", () => {
    expect(describeOwnership(a, new Set(["a", "b"]))).toBe("both");
  });

  it("returns 'missing-parent2' when only parent1 is owned", () => {
    expect(describeOwnership(a, new Set(["a"]))).toBe("missing-parent2");
  });

  it("returns 'missing-parent1' when only parent2 is owned", () => {
    expect(describeOwnership(a, new Set(["b"]))).toBe("missing-parent1");
  });

  it("returns 'none' when neither parent is owned", () => {
    expect(describeOwnership(a, new Set())).toBe("none");
  });
});

describe("scoreCombination", () => {
  it("scores 2 when both parents owned", () => {
    expect(scoreCombination(a, new Set(["a", "b"]))).toBe(2);
  });

  it("scores 1 when one parent owned", () => {
    expect(scoreCombination(a, new Set(["a"]))).toBe(1);
    expect(scoreCombination(a, new Set(["b"]))).toBe(1);
  });

  it("scores 0 when no parent owned", () => {
    expect(scoreCombination(a, new Set())).toBe(0);
  });
});

describe("rankCombinations", () => {
  it("puts both-owned combinations first", () => {
    const owned = new Set(["a", "b"]);
    const result = rankCombinations([c, a, e], owned);
    expect(result[0]).toEqual(a);
  });

  it("puts one-owned combinations in the middle", () => {
    const owned = new Set(["a"]);
    const result = rankCombinations([c, a, e], owned);
    expect(result).toEqual([a, c, e]);
  });

  it("puts none-owned combinations last", () => {
    const owned = new Set<string>();
    const result = rankCombinations([c, a, e], owned);
    expect(result).toEqual([c, a, e]);
  });

  it("preserves original order within same score", () => {
    const owned = new Set(["a"]);
    const result = rankCombinations(
      [c, e, { parent1: "g", parent2: "h" }],
      owned
    );
    expect(result).toEqual([
      c,
      e,
      { parent1: "g", parent2: "h" },
    ]);
  });

  it("does not modify the input array", () => {
    const input: BreedingCombination[] = [c, a, e];
    const snapshot = [...input];
    rankCombinations(input, new Set());
    expect(input).toEqual(snapshot);
  });
});