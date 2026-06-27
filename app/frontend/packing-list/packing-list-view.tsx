import CallToAction from "$/frontend/packing-list/header/call-to-action";
import PackingListDescription from "$/frontend/packing-list/header/packing-list-description";
import PackingListTitle from "$/frontend/packing-list/header/packing-list-title";
import { PackingListProvider } from "$/frontend/packing-list/packing-list-context";
import type { ClientFullPackingList } from "$/transformers/packing-list";
import { Divider, Group, Stack, Text } from "@mantine/core";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import SectionContent from "./section/section-content";

interface Props {
  editable?: boolean;
  list: ClientFullPackingList;
}

export default function PackingListView({ editable = false, list }: Props) {
  return (
    <PackingListProvider value={{ editable }}>
      <Stack gap="xl" maw={1100} mx="auto">
        <Stack gap="xs">
          <Group justify="space-between" align="flex-start">
            <PackingListTitle>{list.name}</PackingListTitle>
            <CallToAction />
          </Group>
          <PackingListDescription>{list.description}</PackingListDescription>
          {list.sourceUrl && (
            <Group gap="xs">
              <ArrowSquareOutIcon size={14} />
              <Text size="xs" c="dimmed">
                Originally from rei.com
              </Text>
            </Group>
          )}
        </Stack>

        <Divider />

        <div
          style={{ columns: "3 260px", columnGap: "var(--mantine-spacing-xl)" }}
        >
          {list.sections.map((section) => (
            <SectionContent key={section.id} section={section} />
          ))}
        </div>
      </Stack>
    </PackingListProvider>
  );
}
