export function readTargetFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const target = params.get("target");
    if (typeof target !== "string") return null;
    const trimmed = target.trim();
    return trimmed.length > 0 ? trimmed : null;
  } catch {
    return null;
  }
}

export function writeTargetToUrl(palKey: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    if (palKey === null) {
      url.searchParams.delete("target");
    } else {
      url.searchParams.set("target", palKey);
    }
    window.history.replaceState({}, "", url);
  } catch {
    // ignore
  }
}

export function buildShareUrl(palKey: string): string {
  if (typeof window === "undefined") {
    return `?target=${encodeURIComponent(palKey)}`;
  }
  const url = new URL(window.location.href);
  url.searchParams.set("target", palKey);
  url.hash = "";
  return url.toString();
}

export async function copyShareUrl(palKey: string): Promise<void> {
  const url = buildShareUrl(palKey);
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    await navigator.clipboard.writeText(url);
    return;
  }
  if (typeof document === "undefined") {
    throw new Error("当前环境不支持复制链接");
  }
  const textarea = document.createElement("textarea");
  textarea.value = url;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!ok) {
    throw new Error("复制失败，请手动复制链接");
  }
}