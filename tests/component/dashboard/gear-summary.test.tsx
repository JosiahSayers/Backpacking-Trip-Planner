import GearSummaryBar from "$/frontend/dashboard/gear-summary";
import type { GearSummary } from "$/frontend/dashboard/types";
import { MantineProvider } from "@mantine/core";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { beforeEach, expect, it } from "bun:test";
import { Router } from "wouter";

const summary: GearSummary = {
  totalItems: 47,
  totalWeightKg: 12.3,
  categoryCount: 8,
};

beforeEach(() => {
  render(
    <MantineProvider>
      <Router hook={() => ["/dashboard", () => {}]}>
        <GearSummaryBar summary={summary} />
      </Router>
    </MantineProvider>,
  );
});

it("renders the total gear item count", () => {
  expect(screen.getByText("47")).toBeInTheDocument();
});

it("renders the total weight in kg", () => {
  expect(screen.getByText("12.3 kg")).toBeInTheDocument();
});

it("renders the category count", () => {
  expect(screen.getByText("8")).toBeInTheDocument();
});

it("renders a link to the gear inventory", () => {
  const link = screen.getByRole("link", { name: "Manage Gear Inventory →" });
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute("href", "/gear");
});
