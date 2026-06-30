import { usePackingList } from "$/frontend/packing-list/packing-list-context";
import { TextInput, Title } from "@mantine/core";
import { useState } from "react";

interface Props {
  value: string;
  onSave?: (name: string) => void;
}

export default function PackingListTitle({ value, onSave }: Props) {
  const { editable } = usePackingList();
  // `value` is the source of truth (driven by the React Query cache); only the
  // in-progress edit lives locally so the displayed name never diverges.
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => {
    const name = draft.trim();
    // A list always needs a name; ignore an empty or unchanged edit.
    if (name && name !== value) {
      onSave?.(name);
    }
    setEditing(false);
  };
  const cancel = () => setEditing(false);

  if (editable && editing) {
    return (
      <TextInput
        value={draft}
        onChange={(e) => setDraft(e.currentTarget.value)}
        onBlur={commit}
        // variant="unstyled"
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") cancel();
        }}
        autoFocus
        flex={1}
        styles={{
          input: {
            fontFamily: "var(--mantine-font-family-headings)",
            fontSize: "var(--mantine-h1-font-size)",
            fontWeight: "var(--mantine-h1-font-weight)" as unknown as number,
            lineHeight: 1.2,
            height: "auto",
          },
        }}
      />
    );
  }

  return (
    <Title
      order={1}
      lh={1.2}
      onClick={
        editable
          ? () => {
              setDraft(value);
              setEditing(true);
            }
          : undefined
      }
      style={editable ? { cursor: "pointer" } : undefined}
    >
      {value}
    </Title>
  );
}
