import PackingListTitle from "$/frontend/packing-list/header/packing-list-title";
import { PackingListProvider } from "$/frontend/packing-list/packing-list-context";
import { MantineProvider } from "@mantine/core";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { useState } from "react";

// `PackingListTitle` is controlled — the displayed name comes from its `value`
// prop (the React Query cache in the real app). This wrapper stands in for that
// owner, updating the value when the title persists an edit.
function renderComponent(
  editable: boolean,
  value = "Summer Trip",
  onSave?: (name: string) => void,
) {
  function Wrapper() {
    const [current, setCurrent] = useState(value);
    return (
      <MantineProvider>
        <PackingListProvider value={{ editable }}>
          <PackingListTitle
            value={current}
            onSave={(name) => {
              onSave?.(name);
              setCurrent(name);
            }}
          />
        </PackingListProvider>
      </MantineProvider>
    );
  }

  render(<Wrapper />);
}

describe("when not editable", () => {
  beforeEach(() => renderComponent(false));

  it("renders the title as a heading", () => {
    expect(
      screen.getByRole("heading", { name: "Summer Trip" }),
    ).toBeInTheDocument();
  });

  it("clicking does not enter edit mode", () => {
    fireEvent.click(screen.getByRole("heading", { name: "Summer Trip" }));
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});

describe("when editable", () => {
  describe("in view mode", () => {
    beforeEach(() => renderComponent(true));

    it("renders the title as a heading", () => {
      expect(
        screen.getByRole("heading", { name: "Summer Trip" }),
      ).toBeInTheDocument();
    });

    it("clicking enters edit mode", () => {
      fireEvent.click(screen.getByRole("heading", { name: "Summer Trip" }));
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
  });

  describe("in edit mode", () => {
    beforeEach(() => {
      renderComponent(true);
      fireEvent.click(screen.getByRole("heading", { name: "Summer Trip" }));
    });

    it("shows an input pre-filled with the current value", () => {
      expect(screen.getByRole("textbox")).toHaveValue("Summer Trip");
    });

    it("pressing Enter commits the draft and returns to view mode", () => {
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "Winter Trip" },
      });
      fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
      expect(
        screen.getByRole("heading", { name: "Winter Trip" }),
      ).toBeInTheDocument();
    });

    it("pressing Escape cancels and restores the original value", () => {
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "Winter Trip" },
      });
      fireEvent.keyDown(screen.getByRole("textbox"), { key: "Escape" });
      expect(
        screen.getByRole("heading", { name: "Summer Trip" }),
      ).toBeInTheDocument();
    });

    it("blurring commits the draft", () => {
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "Winter Trip" },
      });
      fireEvent.blur(screen.getByRole("textbox"));
      expect(
        screen.getByRole("heading", { name: "Winter Trip" }),
      ).toBeInTheDocument();
    });
  });

  describe("onSave", () => {
    it("is called with the trimmed name when the draft changes", () => {
      const onSave = mock();
      renderComponent(true, "Summer Trip", onSave);
      fireEvent.click(screen.getByRole("heading", { name: "Summer Trip" }));
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "  Winter Trip  " },
      });
      fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
      expect(onSave).toHaveBeenCalledTimes(1);
      expect(onSave).toHaveBeenCalledWith("Winter Trip");
    });

    it("is not called when the value is unchanged", () => {
      const onSave = mock();
      renderComponent(true, "Summer Trip", onSave);
      fireEvent.click(screen.getByRole("heading", { name: "Summer Trip" }));
      fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
      expect(onSave).not.toHaveBeenCalled();
    });

    it("is not called when the draft is emptied", () => {
      const onSave = mock();
      renderComponent(true, "Summer Trip", onSave);
      fireEvent.click(screen.getByRole("heading", { name: "Summer Trip" }));
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "   " },
      });
      fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
      expect(onSave).not.toHaveBeenCalled();
    });

    it("is not called when the edit is cancelled with Escape", () => {
      const onSave = mock();
      renderComponent(true, "Summer Trip", onSave);
      fireEvent.click(screen.getByRole("heading", { name: "Summer Trip" }));
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "Winter Trip" },
      });
      fireEvent.keyDown(screen.getByRole("textbox"), { key: "Escape" });
      expect(onSave).not.toHaveBeenCalled();
    });
  });
});
