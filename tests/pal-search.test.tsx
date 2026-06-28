import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import type { Pal } from "../src/types/pal";
import { PalSearch } from "../src/components/PalSearch";

const pals: Pal[] = [
  { id: 1, key: "lamball", number: "001", nameZh: "棉棉羊", nameEn: "Lamball" },
  { id: 100, key: "anubis", number: "100", nameZh: "阿努比斯", nameEn: "Anubis" },
];

describe("PalSearch", () => {
  it("renders input label", () => {
    render(<PalSearch pals={pals} value={null} onSelect={vi.fn()} />);
    expect(
      screen.getByLabelText(/搜索目标帕鲁/i)
    ).toBeInTheDocument();
  });

  it("shows candidates as user types", () => {
    render(<PalSearch pals={pals} value={null} onSelect={vi.fn()} />);
    fireEvent.change(
      screen.getByRole("combobox"),
      { target: { value: "anubis" } }
    );
    const list = screen.getByTestId("search-list");
    expect(within(list).getByText("阿努比斯")).toBeInTheDocument();
  });

  it("shows empty message when no match", () => {
    render(<PalSearch pals={pals} value={null} onSelect={vi.fn()} />);
    fireEvent.change(
      screen.getByRole("combobox"),
      { target: { value: "zzznomatch" } }
    );
    expect(screen.getByTestId("search-empty")).toBeInTheDocument();
  });

  it("calls onSelect when option is clicked", () => {
    const onSelect = vi.fn();
    render(<PalSearch pals={pals} value={null} onSelect={onSelect} />);
    fireEvent.change(
      screen.getByRole("combobox"),
      { target: { value: "anubis" } }
    );
    fireEvent.mouseDown(screen.getByTestId("search-option-anubis"));
    expect(onSelect).toHaveBeenCalledWith(pals[1]);
  });

  it("ArrowDown + Enter selects the highlighted option", () => {
    const onSelect = vi.fn();
    render(<PalSearch pals={pals} value={null} onSelect={onSelect} />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "l" } });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSelect).toHaveBeenCalled();
  });

  it("Escape closes the candidate list", () => {
    render(<PalSearch pals={pals} value={null} onSelect={vi.fn()} />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "anubis" } });
    expect(screen.getByTestId("search-list")).toBeInTheDocument();
    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByTestId("search-list")).not.toBeInTheDocument();
  });
});