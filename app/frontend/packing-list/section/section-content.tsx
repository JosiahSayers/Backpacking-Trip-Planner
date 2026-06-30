import { usePackingList } from "$/frontend/packing-list/packing-list-context";
import ItemList from "$/frontend/packing-list/section/item-list";
import { sortByPosition } from "$/frontend/utils/sort-by-position";
import type { ClientPackingListItem } from "$/transformers/packing-list-item";
import type { ClientPackingListSection } from "$/transformers/packing-list-section";
import { Button, Divider, Stack, Text } from "@mantine/core";
import { PlusIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import SectionHeader from "./section-header";

interface Props {
  section: ClientPackingListSection & { items: ClientPackingListItem[] };
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
  autoEdit: boolean;
}

export default function SectionContent({
  section,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRename,
  onDelete,
  autoEdit,
}: Props) {
  const { editable } = usePackingList();
  const [requiredItems, setRequiredItems] = useState(() =>
    sortByPosition(section.items.filter((i) => !i.optional)),
  );
  const [optionalItems, setOptionalItems] = useState(() =>
    sortByPosition(section.items.filter((i) => i.optional)),
  );
  // Item the user just added, so its row mounts directly in edit mode.
  const [autoEditItemId, setAutoEditItemId] = useState<number | null>(null);
  // Temporary client-side ids for items added before they're persisted.
  const nextTempId = useRef(-1);

  // The new row captures autoEdit on mount, so clear the one-shot signal once
  // consumed — otherwise the item re-enters edit mode whenever its row
  // remounts (e.g. when toggling optional moves it between lists).
  useEffect(() => {
    if (autoEditItemId != null) setAutoEditItemId(null);
  }, [autoEditItemId]);

  function handleAddItem() {
    const id = nextTempId.current--;
    const sortPosition =
      Math.max(
        0,
        ...requiredItems.map((i) => i.sortPosition),
        ...optionalItems.map((i) => i.sortPosition),
      ) + 1;
    setAutoEditItemId(id);
    setRequiredItems((prev) => [
      ...prev,
      { id, name: "New item", optional: false, quantity: 1, sortPosition },
    ]);
  }

  function handleEditItem(updated: ClientPackingListItem) {
    const setter = updated.optional ? setOptionalItems : setRequiredItems;
    setter((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }

  function handleDeleteItem(item: ClientPackingListItem) {
    const setter = item.optional ? setOptionalItems : setRequiredItems;
    setter((prev) => prev.filter((i) => i.id !== item.id));
  }

  function handleToggleOptional(item: ClientPackingListItem) {
    if (item.optional) {
      setOptionalItems((prev) => prev.filter((i) => i.id !== item.id));
      setRequiredItems((prev) => [...prev, { ...item, optional: false }]);
    } else {
      setRequiredItems((prev) => prev.filter((i) => i.id !== item.id));
      setOptionalItems((prev) => [...prev, { ...item, optional: true }]);
    }
  }

  return (
    <Stack gap="xs" pb="xl" style={{ breakInside: "avoid" }}>
      <SectionHeader
        name={section.name}
        isFirst={isFirst}
        isLast={isLast}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onRename={onRename}
        onDelete={onDelete}
        autoEdit={autoEdit}
      />
      <Divider />
      <ItemList
        items={requiredItems}
        onReorder={setRequiredItems}
        onToggleOptional={handleToggleOptional}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
        autoEditItemId={autoEditItemId}
      />

      {optionalItems.length > 0 && (
        <>
          <Text fw={600} size="xs" tt="uppercase" c="dimmed" mt="md">
            Optional
          </Text>
          <ItemList
            items={optionalItems}
            onReorder={setOptionalItems}
            onToggleOptional={handleToggleOptional}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            autoEditItemId={autoEditItemId}
          />
        </>
      )}

      {editable && (
        <Button
          variant="subtle"
          size="xs"
          leftSection={<PlusIcon size={12} />}
          justify="flex-start"
          mt="xs"
          color="gray"
          onClick={handleAddItem}
        >
          Add item
        </Button>
      )}
    </Stack>
  );
}
