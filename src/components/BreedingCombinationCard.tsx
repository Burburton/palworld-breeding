import type { ReactElement } from "react";
import type { BreedingCombination, Pal } from "../types/pal.ts";
import { describeOwnership, OWNERSHIP_LABEL } from "../lib/ownership.ts";

interface BreedingCombinationCardProps {
  combination: BreedingCombination;
  ownedPals: ReadonlySet<string>;
  palsByKey: ReadonlyMap<string, Pal>;
}

function formatPal(key: string, palsByKey: ReadonlyMap<string, Pal>): string {
  const pal = palsByKey.get(key);
  if (!pal) {
    return key;
  }
  return `${pal.nameZh}（${pal.nameEn} · #${pal.number}）`;
}

export function BreedingCombinationCard({
  combination,
  ownedPals,
  palsByKey,
}: BreedingCombinationCardProps): ReactElement {
  const state = describeOwnership(combination, ownedPals);
  const owned1 = ownedPals.has(combination.parent1);
  const owned2 = ownedPals.has(combination.parent2);

  return (
    <article
      className="combo-card"
      data-ownership={state}
      data-testid={`combo-${combination.parent1}-${combination.parent2}`}
    >
      <div className="combo-card__parents">
        <span
          className={
            owned1
              ? "combo-card__parent combo-card__parent--owned"
              : "combo-card__parent"
          }
        >
          {formatPal(combination.parent1, palsByKey)}
        </span>
        <span className="combo-card__plus">+</span>
        <span
          className={
            owned2
              ? "combo-card__parent combo-card__parent--owned"
              : "combo-card__parent"
          }
        >
          {formatPal(combination.parent2, palsByKey)}
        </span>
      </div>
      <div
        className="combo-card__status"
        data-testid={`combo-status-${combination.parent1}-${combination.parent2}`}
      >
        状态：{OWNERSHIP_LABEL[state]}
      </div>
    </article>
  );
}