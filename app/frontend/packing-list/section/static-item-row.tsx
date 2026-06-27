import type { ClientPackingListItem } from "$/transformers/packing-list-item";
import { Text } from "@mantine/core";

interface Props {
  item: ClientPackingListItem;
}

export default function StaticItemRow({ item }: Props) {
  return (
    <>
      <Text size="sm" flex={1}>
        {item.name}
      </Text>
      {item.quantity > 1 && (
        <Text size="xs" c="dimmed">
          ×{item.quantity}
        </Text>
      )}
    </>
  );
}
