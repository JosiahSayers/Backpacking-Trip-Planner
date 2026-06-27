import { usePackingList } from "$/frontend/packing-list/packing-list-context";
import { ActionIcon, Group, Title } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { PencilIcon, TrashIcon } from "@phosphor-icons/react";

export default function SectionHeader({ name }: { name: string }) {
  const { editable } = usePackingList();
  const { hovered, ref } = useHover<HTMLDivElement>();
  const BasicTitle = () => <Title order={5}>{name}</Title>;

  return editable ? (
    <Group ref={ref} justify="space-between" align="center">
      <BasicTitle />
      <Group gap={2} style={{ visibility: hovered ? "visible" : "hidden" }}>
        <ActionIcon variant="subtle" color="gray" size="xs">
          <PencilIcon size={12} />
        </ActionIcon>
        <ActionIcon variant="subtle" color="red" size="xs">
          <TrashIcon size={12} />
        </ActionIcon>
      </Group>
    </Group>
  ) : (
    <BasicTitle />
  );
}
