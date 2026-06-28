import { useEffect, useMemo, useState, type ReactElement } from "react";
import type {
  BreedingRule,
  DataMetadata,
  DataSnapshot,
  Pal,
} from "./types/pal.ts";
import { Header } from "./components/Header.tsx";
import { Footer } from "./components/Footer.tsx";
import { PalSearch } from "./components/PalSearch.tsx";
import { BreedingResult } from "./components/BreedingResult.tsx";
import { OwnedPalSelector } from "./components/OwnedPalSelector.tsx";
import { ShareSection } from "./components/ShareSection.tsx";
import { useOwnedPals } from "./hooks/useOwnedPals.ts";
import { buildBreedingIndex, getBreedingCombinations } from "./lib/breeding.ts";
import { readTargetFromUrl, writeTargetToUrl } from "./lib/share.ts";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; data: DataSnapshot }
  | { status: "error"; message: string };

function App(): ReactElement {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [targetKey, setTargetKey] = useState<string | null>(() => readTargetFromUrl());
  const owned = useOwnedPals();

  useEffect(() => {
    let cancelled = false;
    async function load(): Promise<void> {
      try {
        const [palsRes, breedingRes, metadataRes] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}data/pals.json`),
          fetch(`${import.meta.env.BASE_URL}data/breeding.json`),
          fetch(`${import.meta.env.BASE_URL}data/metadata.json`),
        ]);
        if (!palsRes.ok || !breedingRes.ok || !metadataRes.ok) {
          throw new Error(
            `加载数据失败：pals=${palsRes.status}, breeding=${breedingRes.status}, metadata=${metadataRes.status}`
          );
        }
        const pals = (await palsRes.json()) as Pal[];
        const breeding = (await breedingRes.json()) as BreedingRule[];
        const metadata = (await metadataRes.json()) as DataMetadata;
        if (!cancelled) {
          setLoadState({
            status: "ready",
            data: { pals, breeding, metadata },
          });
        }
      } catch (err) {
        if (!cancelled) {
          setLoadState({
            status: "error",
            message: err instanceof Error ? err.message : "加载失败",
          });
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    writeTargetToUrl(targetKey);
  }, [targetKey]);

  const palsByKey = useMemo(() => {
    if (loadState.status !== "ready") return new Map<string, Pal>();
    return new Map(loadState.data.pals.map((pal) => [pal.key, pal]));
  }, [loadState]);

  const targetPal: Pal | null = useMemo(() => {
    if (!targetKey) return null;
    return palsByKey.get(targetKey) ?? null;
  }, [targetKey, palsByKey]);

  useEffect(() => {
    if (targetKey !== null && loadState.status === "ready" && !targetPal) {
      setTargetKey(null);
    }
  }, [targetKey, targetPal, loadState]);

  const breedingIndex = useMemo(() => {
    if (loadState.status !== "ready") return {};
    return buildBreedingIndex(loadState.data.breeding);
  }, [loadState]);

  const combinations = useMemo(() => {
    if (!targetPal) return [];
    return getBreedingCombinations(breedingIndex, targetPal.key);
  }, [targetPal, breedingIndex]);

  if (loadState.status === "loading") {
    return (
      <div className="app-shell">
        <main className="app-main" data-testid="loading-state">
          <p className="app-status">加载中…</p>
        </main>
      </div>
    );
  }

  if (loadState.status === "error") {
    return (
      <div className="app-shell">
        <main className="app-main" data-testid="error-state">
          <h1>Palworld 配种计算器</h1>
          <p className="app-status app-status--error">
            数据加载失败：{loadState.message}
          </p>
          <p>请刷新页面重试。</p>
        </main>
      </div>
    );
  }

  const { pals, metadata } = loadState.data;

  return (
    <div className="app-shell">
      <Header
        dataVersion={metadata.dataVersion}
        gameVersion={metadata.gameVersion}
      />
      <main className="app-main">
        <PalSearch
          pals={pals}
          value={targetKey}
          onSelect={(pal) => setTargetKey(pal.key)}
        />
        {targetPal ? (
          <BreedingResult
            combinations={combinations}
            palsByKey={palsByKey}
            target={targetPal}
            ownedPals={owned.ownedPals}
          />
        ) : (
          <section className="result result--placeholder" data-testid="no-target">
            <h2>配种结果</h2>
            <p className="result__empty">
              请先在上方搜索并选择目标帕鲁（中文 / 英文 / 编号均可）。
            </p>
          </section>
        )}
        <OwnedPalSelector
          pals={pals}
          ownedKeys={owned.ownedPals}
          onAdd={owned.addOwnedPal}
          onRemove={owned.removeOwnedPal}
          onClear={owned.clearOwnedPals}
        />
        <ShareSection target={targetPal} />
      </main>
      <Footer metadata={metadata} />
    </div>
  );
}

export default App;