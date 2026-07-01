import PackingListCard from "$/frontend/dashboard/packing-lists/packing-list-card";
import type { ClientPackingList } from "$/transformers/packing-list";
import { MantineProvider } from "@mantine/core";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "bun:test";

function renderComponent(list: ClientPackingList) {
  render(
    <MantineProvider>
      <PackingListCard list={list} />
    </MantineProvider>,
  );
}

describe("PackingListCard", () => {
  describe("when totalItems equals totalUniqueItems", () => {
    beforeEach(() =>
      renderComponent({
        id: 1,
        name: "Weekend Kit",
        totalItems: 18,
        totalUniqueItems: 18,
      } as any),
    );

    it("renders the list name", () => {
      expect(screen.getByText("Weekend Kit")).toBeInTheDocument();
    });

    it("renders the item count without unique qualifier", () => {
      expect(screen.getByText("18 items")).toBeInTheDocument();
    });

    it("renders an 'Export PDF' link", () => {
      const link = screen.getByRole("link", { name: "Export PDF" });
      expect(link).toHaveAttribute("href", "/api/packing-lists/1/pdf");
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  describe("when totalItems differs from totalUniqueItems", () => {
    beforeEach(() =>
      renderComponent({
        id: 2,
        name: "Emergency Bag",
        totalItems: 12,
        totalUniqueItems: 16,
      } as any),
    );

    it("renders the item count with unique qualifier", () => {
      expect(screen.getByText("12 items (16 unique)")).toBeInTheDocument();
    });
  });
});
