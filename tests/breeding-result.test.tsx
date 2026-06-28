import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { BreedingCombination, Pal } from "../src/types/pal";
import { BreedingResult } from "../src/components/BreedingResult";

const palsByKey = new Map<string, Pal>([
  ["anubis", { id: 100, key: "anubis", number: "100", nameZh: "阿努比斯", nameEn: "Anubis" }],
  ["penking", { id: 101, key: "penking", number: "101", nameZh: "企丸王", nameEn: "Penking" }],
  ["bushi", { id: 102, key: "bushi", number: "102", nameZh: "武士王", nameEn: "Bushi" }],
  ["lamball", { id: 1, key: "lamball", number: "001", nameZh: "棉棉羊", nameEn: "Lamball" }],
]);

const target: Pal = {
  id: 100,
  key: "anubis",
  number: "100",
  nameZh: "阿努比斯",
  nameEn: "Anubis",
};

const combinations: BreedingCombination[] = [
  { parent1: "penking", parent2: "bushi" },
  { parent1: "lamball", parent2: "anubis" },
];

describe("BreedingResult", () => {
  it("renders empty state when no combinations", () => {
    render(
      <BreedingResult
        combinations={[]}
        palsByKey={palsByKey}
        target={target}
        ownedPals={new Set()}
      />
    );
    expect(screen.getByTestId("breeding-empty")).toBeInTheDocument();
  });

  it("renders combinations and ownership status", () => {
    render(
      <BreedingResult
        combinations={combinations}
        palsByKey={palsByKey}
        target={target}
        ownedPals={new Set(["penking", "bushi"])}
      />
    );
    expect(screen.getByTestId("breeding-result")).toBeInTheDocument();
    expect(
      screen.getByTestId("combo-status-penking-bushi")
    ).toHaveTextContent("两个父母都已拥有");
  });

  it("shows more button when combinations exceed default page size", () => {
    const many: BreedingCombination[] = Array.from({ length: 25 }, (_, i) => ({
      parent1: "penking",
      parent2: i % 2 === 0 ? "bushi" : "lamball",
    }));
    render(
      <BreedingResult
        combinations={many}
        palsByKey={palsByKey}
        target={target}
        ownedPals={new Set()}
      />
    );
    expect(screen.getByTestId("show-more")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("show-more"));
    expect(screen.getByTestId("show-more")).toBeInTheDocument();
  });

  it("marks missing parents in status text", () => {
    render(
      <BreedingResult
        combinations={combinations}
        palsByKey={palsByKey}
        target={target}
        ownedPals={new Set(["penking"])}
      />
    );
    expect(
      screen.getByTestId("combo-status-penking-bushi")
    ).toHaveTextContent("缺少父母 2");
  });

  it("marks both missing", () => {
    render(
      <BreedingResult
        combinations={combinations}
        palsByKey={palsByKey}
        target={target}
        ownedPals={new Set()}
      />
    );
    expect(
      screen.getByTestId("combo-status-lamball-anubis")
    ).toHaveTextContent("两个父母都未拥有");
  });
});

describe("export sanity", () => {
  it("is exported as a named function", () => {
    expect(typeof BreedingResult).toBe("function");
  });

  it("default unused vi import won't break build", () => {
    expect(vi).toBeDefined();
  });
});