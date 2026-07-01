import AppLink from "$/frontend/app-link";
import { usePackingLists } from "$/frontend/utils/api/packing-list";
import {
  Button,
  Card,
  Group,
  SimpleGrid,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";
import { FilePdfIcon, ListBulletsIcon, PlusIcon } from "@phosphor-icons/react";

export default function PackingLists() {
  const { data: lists, isFetching } = usePackingLists();

  return (
    <section>
      <Group justify="space-between" mb="md" align="flex-end">
        <div>
          <Title order={2}>My Packing Lists</Title>
          <Text c="dimmed" size="sm">
            Lists not attached to a trip
          </Text>
        </div>
        <Button leftSection={<PlusIcon size={16} />} variant="light">
          New List
        </Button>
      </Group>

      {isFetching ? (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          <Card>
            <Skeleton height={16} width="60%" mb="xs" />
            <Skeleton height={12} width="30%" mb="md" />
            <Skeleton height={28} width={90} />
          </Card>
        </SimpleGrid>
      ) : !lists || lists.length === 0 ? (
        <Text c="dimmed">
          No Packing lists yet. Create a list or attach one to a trip.
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {lists.map((list) => (
            <Card key={list.id}>
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
              >
                Export PDF
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <Group justify="flex-end" mt="sm">
        <AppLink href="/packing-lists">View all lists</AppLink>
      </Group>
    </section>
  );
}
