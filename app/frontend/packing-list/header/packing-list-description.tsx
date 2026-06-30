import { usePackingList } from "$/frontend/packing-list/packing-list-context";
import { Text, Textarea } from "@mantine/core";
import { useState } from "react";

interface Props {
  value: string | null;
}

export default function PackingListDescription({ value: initialValue }: Props) {
  const { editable } = usePackingList();
  const [value, setValue] = useState(initialValue ?? "");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => {
    setValue(draft.trim());
    setEditing(false);
  };
  const cancel = () => setEditing(false);

  if (editable && editing) {
    return (
      <Textarea
        value={draft}
        onChange={(e) => setDraft(e.currentTarget.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            commit();
          }
          if (e.key === "Escape") cancel();
        }}
        autoFocus
        autosize
        minRows={1}
        size="sm"
        maw={560}
        w="100%"
      />
    );
  }

  // Nothing to show for read-only viewers when there's no description.
  if (!value && !editable) return null;

  return (
    <Text
      c="dimmed"
      size="sm"
      maw={560}
      fs={value ? undefined : "italic"}
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
      {value || "Add a description"}
    </Text>
  );
}
