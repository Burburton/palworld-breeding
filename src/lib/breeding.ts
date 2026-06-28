import type {
  BreedingCombination,
  BreedingRule,
} from "../types/pal.ts";

export type BreedingIndex = Record<string, BreedingCombination[]>;

export function buildBreedingIndex(rules: readonly BreedingRule[]): BreedingIndex {
  const index: BreedingIndex = {};
  for (const rule of rules) {
    const list = index[rule.child];
    if (list) {
      list.push({ parent1: rule.parent1, parent2: rule.parent2 });
    } else {
      index[rule.child] = [{ parent1: rule.parent1, parent2: rule.parent2 }];
    }
  }
  return index;
}

export function getBreedingCombinations(
  index: BreedingIndex,
  targetPalKey: string
): BreedingCombination[] {
  return index[targetPalKey] ?? [];
}