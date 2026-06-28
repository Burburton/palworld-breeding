import { useState, type ReactElement } from "react";
import type {
  BreedingCombination,
  Pal,
} from "../types/pal.ts";
import { BreedingCombinationCard } from "./BreedingCombinationCard.tsx";
import { rankCombinations } from "../lib/ownership.ts";

const DEFAULT_PAGE_SIZE = 10;

interface BreedingResultProps {
  combinations: readonly BreedingCombination[];
  palsByKey: ReadonlyMap<string, Pal>;
  target: Pal;
  ownedPals: ReadonlySet<string>;
}

export function BreedingResult({
  combinations,
  palsByKey,
  target,
  ownedPals,
}: BreedingResultProps): ReactElement {
  const [visibleCount, setVisibleCount] = useState(DEFAULT_PAGE_SIZE);

  if (combinations.length === 0) {
    return (
      <section className="result" data-testid="breeding-empty">
        <h2>配种结果</h2>
        <p className="result__empty">
          目标帕鲁 <strong>{target.nameZh}</strong> 暂无可用的直接父母组合。
        </p>
      </section>
    );
  }

  const sortedByOwnership = rankCombinations(combinations, ownedPals);

  const visible = sortedByOwnership.slice(0, visibleCount);
  const canShowMore = sortedByOwnership.length > visibleCount;

  return (
    <section className="result" data-testid="breeding-result">
      <header className="result__header">
        <h2>
          配种结果：{target.nameZh}（{target.nameEn} · #{target.number}）
        </h2>
        <p className="result__summary">
          共 {combinations.length} 组直接父母组合。两个父母都已拥有的组合排在最前。
        </p>
      </header>
      <div className="result__list" role="list">
        {visible.map((combination, index) => (
          <div
            key={`${combination.parent1}::${combination.parent2}::${index}`}
            role="listitem"
          >
            <BreedingCombinationCard
              combination={combination}
              ownedPals={ownedPals}
              palsByKey={palsByKey}
            />
          </div>
        ))}
      </div>
      {canShowMore ? (
        <button
          type="button"
          className="result__more"
          onClick={() => setVisibleCount((count) => count + DEFAULT_PAGE_SIZE)}
          data-testid="show-more"
        >
          显示更多
        </button>
      ) : null}
    </section>
  );
}