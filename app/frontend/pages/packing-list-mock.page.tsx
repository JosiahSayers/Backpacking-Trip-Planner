import { MOCK_LIST } from "$/frontend/packing-list/mock-data";
import PackingListView from "$/frontend/packing-list/packing-list-view";
import { Stack, Tabs } from "@mantine/core";

export default function PackingListMockPage() {
  return (
    <Stack gap={0}>
      <Tabs defaultValue="public" keepMounted={false}>
        <Tabs.List
          px={{ base: "md", md: "xl" }}
          pos="sticky"
          top={0}
          style={{
            zIndex: 10,
          }}
        >
          <Tabs.Tab value="public">Public view</Tabs.Tab>
          <Tabs.Tab value="editable">Editable view</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="public" py="xl" px={{ base: "md", md: "xl" }}>
          <PackingListView list={MOCK_LIST} />
        </Tabs.Panel>

        <Tabs.Panel value="editable" py="xl" px={{ base: "md", md: "xl" }}>
          <PackingListView list={MOCK_LIST} editable />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
