import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
} from "react";
import type { Pal } from "../types/pal.ts";
import { searchPals } from "../lib/search.ts";

interface PalSearchProps {
  pals: readonly Pal[];
  value: string | null;
  onSelect: (pal: Pal) => void;
}

export function PalSearch({
  pals,
  value,
  onSelect,
}: PalSearchProps): ReactElement {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const inputId = useId();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const candidates = useMemo(() => searchPals(pals, query), [pals, query]);
  const selectedKey = value;

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const choose = useCallback(
    (pal: Pal) => {
      onSelect(pal);
      setQuery("");
      setIsOpen(false);
      inputRef.current?.blur();
    },
    [onSelect]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setIsOpen(true);
        setActiveIndex((index) =>
          candidates.length === 0 ? 0 : (index + 1) % candidates.length
        );
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setIsOpen(true);
        setActiveIndex((index) =>
          candidates.length === 0
            ? 0
            : (index - 1 + candidates.length) % candidates.length
        );
      } else if (event.key === "Enter") {
        if (!isOpen) {
          setIsOpen(true);
          return;
        }
        const candidate = candidates[activeIndex];
        if (candidate) {
          event.preventDefault();
          choose(candidate);
        }
      } else if (event.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    },
    [activeIndex, candidates, choose, isOpen]
  );

  const showNoResults =
    isOpen && query.trim().length > 0 && candidates.length === 0;

  return (
    <section className="pal-search" ref={containerRef}>
      <label className="pal-search__label" htmlFor={inputId}>
        搜索目标帕鲁（中文 / 英文 / 编号）
      </label>
      <div className="pal-search__field">
        <input
          id={inputId}
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={
            isOpen && candidates[activeIndex]
              ? `${listboxId}-${candidates[activeIndex].key}`
              : undefined
          }
          autoComplete="off"
          inputMode="search"
          placeholder="例如：阿努比斯 / Anubis / 100"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          className="pal-search__input"
        />
      </div>

      {selectedKey !== null && !isOpen ? (
        <div className="pal-search__selected" data-testid="selected-target">
          当前目标：<strong>{selectedKey}</strong>
        </div>
      ) : null}

      {isOpen && candidates.length > 0 ? (
        <ul
          id={listboxId}
          role="listbox"
          className="pal-search__list"
          data-testid="search-list"
        >
          {candidates.map((pal, index) => (
            <li
              key={pal.key}
              id={`${listboxId}-${pal.key}`}
              role="option"
              aria-selected={index === activeIndex}
              className={
                index === activeIndex
                  ? "pal-search__option pal-search__option--active"
                  : "pal-search__option"
              }
              onMouseDown={(event) => {
                event.preventDefault();
                choose(pal);
              }}
              onMouseEnter={() => setActiveIndex(index)}
              data-testid={`search-option-${pal.key}`}
            >
              <span className="pal-search__option-number">{pal.number}</span>
              <span className="pal-search__option-zh">{pal.nameZh}</span>
              <span className="pal-search__option-en">{pal.nameEn}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {showNoResults ? (
        <div className="pal-search__empty" data-testid="search-empty">
          没有匹配的目标帕鲁。
        </div>
      ) : null}
    </section>
  );
}