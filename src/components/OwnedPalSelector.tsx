import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import type { Pal } from "../types/pal.ts";
import { searchPals } from "../lib/search.ts";

interface OwnedPalSelectorProps {
  pals: readonly Pal[];
  ownedKeys: ReadonlySet<string>;
  onAdd: (palKey: string) => void;
  onRemove: (palKey: string) => void;
  onClear: () => void;
}

export function OwnedPalSelector({
  pals,
  ownedKeys,
  onAdd,
  onRemove,
  onClear,
}: OwnedPalSelectorProps): ReactElement {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const candidates = useMemo(
    () => searchPals(pals, query, 8).filter((pal) => !ownedKeys.has(pal.key)),
    [pals, query, ownedKeys]
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const choose = useCallback(
    (pal: Pal) => {
      onAdd(pal.key);
      setQuery("");
      inputRef.current?.focus();
    },
    [onAdd]
  );

  const ownedList = useMemo(
    () =>
      pals
        .filter((pal) => ownedKeys.has(pal.key))
        .sort((a, b) => a.nameZh.localeCompare(b.nameZh, "zh")),
    [pals, ownedKeys]
  );

  return (
    <section className="owned-selector" data-testid="owned-selector">
      <h2>我拥有的帕鲁</h2>
      <label className="owned-selector__label" htmlFor={inputId}>
        添加到拥有列表
      </label>
      <div className="owned-selector__field">
        <input
          id={inputId}
          ref={inputRef}
          type="text"
          autoComplete="off"
          inputMode="search"
          placeholder="输入中文 / 英文 / 编号"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="owned-selector__input"
        />
      </div>
      {query.trim().length > 0 ? (
        candidates.length > 0 ? (
          <ul className="owned-selector__candidates" role="listbox">
            {candidates.map((pal, index) => (
              <li
                key={pal.key}
                role="option"
                aria-selected={index === activeIndex}
                className={
                  index === activeIndex
                    ? "owned-selector__option owned-selector__option--active"
                    : "owned-selector__option"
                }
                onMouseDown={(event) => {
                  event.preventDefault();
                  choose(pal);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                data-testid={`owned-option-${pal.key}`}
              >
                {pal.nameZh}（{pal.nameEn} · #{pal.number}）
              </li>
            ))}
          </ul>
        ) : (
          <div className="owned-selector__empty" data-testid="owned-search-empty">
            没有可添加的匹配项。
          </div>
        )
      ) : null}
      {ownedList.length > 0 ? (
        <div className="owned-selector__list" data-testid="owned-list">
          {ownedList.map((pal) => (
            <span className="owned-chip" key={pal.key} data-testid={`owned-chip-${pal.key}`}>
              {pal.nameZh}
              <button
                type="button"
                className="owned-chip__remove"
                aria-label={`移除 ${pal.nameZh}`}
                onClick={() => onRemove(pal.key)}
                data-testid={`owned-remove-${pal.key}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="owned-selector__hint">尚未添加任何帕鲁。</p>
      )}
      {ownedList.length > 0 ? (
        <button
          type="button"
          className="owned-selector__clear"
          onClick={onClear}
          data-testid="owned-clear"
        >
          清空
        </button>
      ) : null}
    </section>
  );
}