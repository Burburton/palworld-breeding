import { describe, expect, it } from "vitest";
import type { BreedingRule } from "../src/types/pal";
import {
  buildBreedingIndex,
  getBreedingCombinations,
} from "../src/lib/breeding";

describe("buildBreedingIndex", () => {
  it("groups combinations by child", () => {
    const rules: BreedingRule[] = [
      { parent1: "a", parent2: "b", child: "x" },
      { parent1: "c", parent2: "d", child: "x" },
      { parent1: "e", parent2: "f", child: "y" },
    ];
    const index = buildBreedingIndex(rules);
    expect(index.x).toEqual([
      { parent1: "a", parent2: "b" },
      { parent1: "c", parent2: "d" },
    ]);
    expect(index.y).toEqual([{ parent1: "e", parent2: "f" }]);
  });

  it("returns empty index for empty rules", () => {
    expect(buildBreedingIndex([])).toEqual({});
  });
});

describe("getBreedingCombinations", () => {
  const rules: BreedingRule[] = [
    { parent1: "a", parent2: "b", child: "x" },
    { parent1: "c", parent2: "d", child: "x" },
  ];
  const index = buildBreedingIndex(rules);

  it("returns combinations for known child", () => {
    expect(getBreedingCombinations(index, "x")).toHaveLength(2);
  });

  it("returns empty array for unknown child", () => {
    expect(getBreedingCombinations(index, "ghost")).toEqual([]);
  });
});