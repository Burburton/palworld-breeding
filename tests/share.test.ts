import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildShareUrl,
  copyShareUrl,
  readTargetFromUrl,
  writeTargetToUrl,
} from "../src/lib/share";

describe("readTargetFromUrl", () => {
  it("returns the target param when present", () => {
    window.history.replaceState(
      {},
      "",
      "/?target=anubis"
    );
    expect(readTargetFromUrl()).toBe("anubis");
  });

  it("trims whitespace around the target", () => {
    window.history.replaceState({}, "", "/?target=%20anubis%20");
    expect(readTargetFromUrl()).toBe("anubis");
  });

  it("returns null when missing", () => {
    window.history.replaceState({}, "", "/");
    expect(readTargetFromUrl()).toBeNull();
  });

  it("returns null when target is empty", () => {
    window.history.replaceState({}, "", "/?target=");
    expect(readTargetFromUrl()).toBeNull();
  });
});

describe("writeTargetToUrl", () => {
  it("sets target param using replaceState", () => {
    writeTargetToUrl("anubis");
    expect(window.location.search).toContain("target=anubis");
  });

  it("removes target param when given null", () => {
    writeTargetToUrl("anubis");
    writeTargetToUrl(null);
    expect(window.location.search).not.toContain("target=");
  });
});

describe("buildShareUrl", () => {
  it("includes base origin and target param", () => {
    window.history.replaceState({}, "", "/foo/bar?baz=1");
    const url = buildShareUrl("anubis");
    expect(url).toContain("target=anubis");
  });

  it("encodes special characters", () => {
    const url = buildShareUrl("a b/c");
    expect(url).not.toContain("a b/c");
    expect(url).toMatch(/target=a(\+|%20)b%2Fc/);
  });
});

describe("copyShareUrl", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(async () => undefined),
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses navigator.clipboard.writeText when available", async () => {
    await copyShareUrl("anubis");
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    const arg = (navigator.clipboard.writeText as ReturnType<typeof vi.fn>)
      .mock.calls[0]?.[0];
    expect(String(arg)).toContain("target=anubis");
  });

  it("falls back to execCommand when clipboard is unavailable", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    const execCommand = vi.fn(() => true);
    document.execCommand = execCommand;
    await expect(copyShareUrl("anubis")).resolves.toBeUndefined();
    expect(execCommand).toHaveBeenCalledWith("copy");
  });

  it("rejects when fallback execCommand fails", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    document.execCommand = vi.fn(() => false);
    await expect(copyShareUrl("anubis")).rejects.toThrow();
  });
});