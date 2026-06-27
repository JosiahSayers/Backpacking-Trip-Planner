import StaticItemRow from "$/frontend/packing-list/section/static-item-row";
import type { ClientPackingListItem } from "$/transformers/packing-list-item";
import { useDndContext } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { ActionIcon, Badge, TextInput } from "@mantine/core";
import { DotsSixVerticalIcon, TrashIcon } from "@phosphor-icons/react";
import { useState } from "react";

interface Props {
  item: ClientPackingListItem;
  onToggleOptional: () => void;
}

export default function EditableItemRow({ item, onToggleOptional }: Props) {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.name);
  const { active: dndActive } = useDndContext();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const commit = () => setEditing(false);
  const cancel = () => {
    setValue(item.name);
    setEditing(false);
  };

  if (editing) {
    return (
      <TextInput
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") cancel();
        }}
        autoFocus
        size="xs"
        my={2}
      />
    );
  }

  const showControls = hovered && !isDragging && dndActive === null;

  return (
    <div
      ref={setNodeRef}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 6,
        paddingRight: 6,
        // Drop scaleX/scaleY from the dnd-kit transform — the scale causes long
        // rows to squish vertically during drag with verticalListSortingStrategy.
        transform: transform
          ? `translate3d(${Math.round(transform.x)}px, ${Math.round(transform.y)}px, 0)`
          : undefined,
        transition,
        opacity: isDragging ? 0.4 : 1,
        cursor: "pointer",
        borderRadius: "var(--mantine-radius-sm)",
        background: showControls
          ? "var(--mantine-color-default-hover)"
          : undefined,
        margin: "0 -6px",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setEditing(true)}
    >
      <ActionIcon
        variant="transparent"
        color="gray"
        size="xs"
        style={{
          visibility: showControls ? "visible" : "hidden",
          cursor: "grab",
          flexShrink: 0,
        }}
        {...listeners}
        {...attributes}
        onClick={(e) => e.stopPropagation()}
      >
        <DotsSixVerticalIcon size={12} />
      </ActionIcon>
      <StaticItemRow item={item} />
      <Badge
        variant={
          item.optional && !showControls
            ? "transparent"
            : item.optional
              ? "light"
              : "outline"
        }
        color="gray"
        size="sm"
        opacity={item.optional && !showControls ? 0.45 : 1}
        style={{
          cursor: "pointer",
          flexShrink: 0,
          visibility: item.optional || showControls ? "visible" : "hidden",
          userSelect: "none",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggleOptional();
        }}
      >
        {item.optional && showControls ? "Optional ×" : "optional"}
      </Badge>
      <ActionIcon
        variant="subtle"
        color="gray"
        size="xs"
        style={{
          visibility: showControls ? "visible" : "hidden",
          flexShrink: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <TrashIcon size={12} />
      </ActionIcon>
    </div>
  );
}
