import { usePackingList } from "$/frontend/packing-list/packing-list-context";
import { ActionIcon, Group, Title } from "@mantine/core";
import { PencilIcon } from "@phosphor-icons/react";
import type { PropsWithChildren } from "react";

export default function PackingListTitle({ children }: PropsWithChildren) {
  const { editable } = usePackingList();

  return (
    <Group gap={4} align="center">
      <Title order={1} lh={1.2}>
        {children}
      </Title>
      {editable && (
        <ActionIcon variant="subtle" color="gray" size="md" mt={4}>
          <PencilIcon size={16} />
        </ActionIcon>
      )}
    </Group>
  );
}
