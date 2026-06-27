import { usePackingList } from "$/frontend/packing-list/packing-list-context";
import { ActionIcon, Group, Text } from "@mantine/core";
import { PencilIcon } from "@phosphor-icons/react";
import type { PropsWithChildren } from "react";

export default function PackingListDescription({
  children,
}: PropsWithChildren) {
  const { editable } = usePackingList();

  return (
    children && (
      <Group gap={4} align="flex-start">
        <Text c="dimmed" size="sm" maw={560}>
          {children}
        </Text>
        {editable && (
          <ActionIcon variant="subtle" color="gray" size="xs" mt={2}>
            <PencilIcon size={12} />
          </ActionIcon>
        )}
      </Group>
    )
  );
}
