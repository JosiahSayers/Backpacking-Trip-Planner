import PackingLists from "$/frontend/dashboard/packing-lists";
import { packingListKeys } from "$/frontend/utils/api/packing-list";
import type { ClientPackingList } from "$/transformers/packing-list";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "bun:test";
import { Router } from "wouter";

function renderComponent(lists: ClientPackingList[]) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  queryClient.setQueryData(packingListKeys.all(), lists);
  render(
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Router hook={() => ["/dashboard", () => {}]}>
          <PackingLists />
        </Router>
      </MantineProvider>
    </QueryClientProvider>,
  );
}

describe("while loading", () => {
  beforeEach(() => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    queryClient.prefetchQuery({
      queryKey: packingListKeys.all(),
      queryFn: () => new Promise<ClientPackingList[]>(() => {}),
    });
    render(
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <Router hook={() => ["/dashboard", () => {}]}>
            <PackingLists />
          </Router>
        </MantineProvider>
      </QueryClientProvider>,
    );
  });

  it("renders the section heading", () => {
    expect(
      screen.getByRole("heading", { level: 2, name: "My Packing Lists" }),
    ).toBeInTheDocument();
  });

  it("does not render the empty state message", () => {
    expect(
      screen.queryByText(
        "No Packing lists yet. Create a list or attach one to a trip.",
      ),
    ).not.toBeInTheDocument();
  });

  it("does not render list cards", () => {
    expect(
      screen.queryByRole("button", { name: "Export PDF" }),
    ).not.toBeInTheDocument();
  });
});

describe("when there are no lists", () => {
  beforeEach(() => renderComponent([]));

  it("renders the section heading", () => {
    expect(
      screen.getByRole("heading", { level: 2, name: "My Packing Lists" }),
    ).toBeInTheDocument();
  });

  it("renders the empty state message", () => {
    expect(
      screen.getByText(
        "No Packing lists yet. Create a list or attach one to a trip.",
      ),
    ).toBeInTheDocument();
  });

  it("renders a 'New List' button", () => {
    expect(
      screen.getByRole("button", { name: "New List" }),
    ).toBeInTheDocument();
  });

  it("renders a 'View all lists' link to /packing-lists", () => {
    const link = screen.getByRole("link", { name: "View all lists" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/packing-lists");
  });
});

describe("when there are lists", () => {
  const lists: ClientPackingList[] = [
    { id: 1, name: "Weekend Kit", totalItems: 18, totalUniqueItems: 18 },
    { id: 2, name: "Emergency Bag", totalItems: 12, totalUniqueItems: 16 },
  ] as any;

  beforeEach(() => renderComponent(lists));

  it("renders each list by name", () => {
    expect(screen.getByText("Weekend Kit")).toBeInTheDocument();
    expect(screen.getByText("Emergency Bag")).toBeInTheDocument();
  });

  it("renders the item count for each list", () => {
    expect(screen.getByText("18 items")).toBeInTheDocument();
    expect(screen.getByText("12 items (16 unique)")).toBeInTheDocument();
  });

  it("renders an 'Export PDF' button for each list", () => {
    expect(screen.getAllByRole("button", { name: "Export PDF" })).toHaveLength(
      2,
    );
  });
});
