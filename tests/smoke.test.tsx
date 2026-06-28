import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App";

test("renders loading state initially", () => {
  render(<App />);
  expect(screen.getByTestId("loading-state")).toBeInTheDocument();
});