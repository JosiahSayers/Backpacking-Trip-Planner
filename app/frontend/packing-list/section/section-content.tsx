import { usePackingList } from "$/frontend/packing-list/packing-list-context";
import ItemList from "$/frontend/packing-list/section/item-list";
import type { ClientPackingListItem } from "$/transformers/packing-list-item";
import type { ClientPackingListSection } from "$/transformers/packing-list-section";
import { Button, Divider, Stack, Text } from "@mantine/core";
import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import SectionHeader from "./section-header";

interface Props {
  section: ClientPackingListSection & { items: ClientPackingListItem[] };
}

export default function SectionContent({ section }: Props) {
  const { editable } = usePackingList();
  const [requiredItems, setRequiredItems] = useState(
    section.items.filter((i) => !i.optional),
  );
  const [optionalItems, setOptionalItems] = useState(
    section.items.filter((i) => i.optional),
  );

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
      <SectionHeader name={section.name} />
      <Divider />
      <ItemList
        items={requiredItems}
        onReorder={setRequiredItems}
        onToggleOptional={handleToggleOptional}
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
        >
          Add item
        </Button>
      )}
    </Stack>
  );
}
