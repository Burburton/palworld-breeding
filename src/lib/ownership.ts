import type { BreedingCombination } from "../types/pal.ts";

export type OwnershipState =
  | "both"
  | "missing-parent1"
  | "missing-parent2"
  | "none";

export const OWNERSHIP_LABEL: Record<OwnershipState, string> = {
  both: "两个父母都已拥有",
  "missing-parent1": "缺少父母 1",
  "missing-parent2": "缺少父母 2",
  none: "两个父母都未拥有",
};

export function describeOwnership(
  combination: BreedingCombination,
  ownedPals: ReadonlySet<string>
): OwnershipState {
  const has1 = ownedPals.has(combination.parent1);
  const has2 = ownedPals.has(combination.parent2);
  if (has1 && has2) return "both";
  if (has1) return "missing-parent2";
  if (has2) return "missing-parent1";
  return "none";
}

export function ownershipOrder(state: OwnershipState): number {
  switch (state) {
    case "both":
      return 0;
    case "missing-parent1":
    case "missing-parent2":
      return 1;
    case "none":
      return 2;
  }
}

export function scoreCombination(
  combination: BreedingCombination,
  ownedPals: ReadonlySet<string>
): number {
  const state = describeOwnership(combination, ownedPals);
  if (state === "both") return 2;
  if (state === "missing-parent1" || state === "missing-parent2") return 1;
  return 0;
}

export function rankCombinations(
  combinations: readonly BreedingCombination[],
  ownedPals: ReadonlySet<string>
): BreedingCombination[] {
  return combinations
    .map((combination, originalIndex) => ({
      combination,
      originalIndex,
      score: scoreCombination(combination, ownedPals),
    }))
    .sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      return a.originalIndex - b.originalIndex;
    })
    .map((item) => item.combination);
}