import type { ReactElement } from "react";
import { useState } from "react";
import type { Pal } from "../types/pal.ts";
import { copyShareUrl } from "../lib/share.ts";

interface ShareSectionProps {
  target: Pal | null;
}

export function ShareSection({ target }: ShareSectionProps): ReactElement {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleCopy = async (): Promise<void> => {
    if (!target) return;
    try {
      await copyShareUrl(target.key);
      setState("copied");
      setError(null);
      window.setTimeout(() => setState("idle"), 2000);
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "复制失败");
    }
  };

  return (
    <section className="share-section" data-testid="share-section">
      <h2>分享</h2>
      <button
        type="button"
        className="share-section__button"
        disabled={!target}
        onClick={handleCopy}
        data-testid="copy-share-url"
      >
        复制当前结果链接
      </button>
      {state === "copied" ? (
        <p className="share-section__feedback" data-testid="share-feedback">
          已复制到剪贴板。
        </p>
      ) : null}
      {state === "error" && error ? (
        <p className="share-section__feedback share-section__feedback--error">
          {error}
        </p>
      ) : null}
    </section>
  );
}