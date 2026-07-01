import type { ClientPackingList } from "$/transformers/packing-list";
import { Button, Card, Group, Text } from "@mantine/core";
import { FilePdfIcon, ListBulletsIcon } from "@phosphor-icons/react";

interface Props {
  list: ClientPackingList;
}

export default function PackingListCard({ list }: Props) {
  return (
    <Card>
      <Group gap="xs" mb="xs">
        <ListBulletsIcon size={18} />
        <Text fw={600}>{list.name}</Text>
      </Group>
      <Group gap="md" c="dimmed" mb="md">
        <Text size="sm">
          {list.totalItems === list.totalUniqueItems
            ? `${list.totalItems} items`
            : `${list.totalItems} items (${list.totalUniqueItems} unique)`}
        </Text>
      </Group>
      <Button
        size="xs"
        variant="subtle"
        leftSection={<FilePdfIcon size={14} />}
        component="a"
        href={`/api/packing-lists/${list.id}/pdf`}
        target="_blank"
      >
        Export PDF
      </Button>
    </Card>
  );
}
