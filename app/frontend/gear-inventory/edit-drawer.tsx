import { useCreateGearInventoryItem } from "$/frontend/utils/api/gear-inventory";
import type { ClientGearInventoryItem } from "$/transformers/gear-inventory-item";
import {
  Autocomplete,
  Button,
  Drawer,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { schemaResolver, useForm } from "@mantine/form";
import { useEffect } from "react";
import { z } from "zod/v4";

const formSchema = z.object({
  name: z.string().min(1, { error: "Name is required" }),
  category: z.string().min(1, { error: "Category is required" }),
  quantity: z.int().min(1),
  grams: z.preprocess((v) => (v === "" ? undefined : v), z.int().optional()),
});

interface Props {
  opened: boolean;
  onClose: () => void;
  item: ClientGearInventoryItem | null;
}

export default function EditDrawer({ opened, onClose, item }: Props) {
  const createItem = useCreateGearInventoryItem();

  const form = useForm({
    initialValues: {
      name: "",
      category: "",
      quantity: 1,
      grams: "" as string | number,
    },
    validate: schemaResolver(formSchema, { sync: true }),
  });

  useEffect(() => {
    form.setValues({
      name: item?.name ?? "",
      category: item?.category.name ?? "",
      quantity: item?.quantity ?? 1,
      grams: item?.grams ?? "",
    });
  }, [item]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = form.onSubmit((values) => {
    if (item === null) {
      createItem.mutate(
        {
          name: values.name,
          quantity: values.quantity as number,
          newCategoryName: values.category,
          grams: values.grams === "" ? undefined : (values.grams as number),
        },
        {
          onSuccess: handleClose,
        },
      );
    } else {
      console.log("User tried to edit the item", values);
    }
  });

  return (
    <Drawer
      opened={opened}
      onClose={handleClose}
      title={
        <Text fw={700} size="lg" ff="var(--mantine-font-family-headings)">
          {item ? "Edit item" : "Add item"}
        </Text>
      }
      position="right"
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md" pt="xs">
          <TextInput
            label="Item name"
            placeholder="e.g. Big Agnes Copper Spur UL2"
            required
            {...form.getInputProps("name")}
          />
          <Autocomplete
            label="Category"
            placeholder="Search or type to create…"
            data={["Shelter"]} // TODO: Replace with api call to category search endpoint
            description="Pick an existing category or type a new one."
            required
            {...form.getInputProps("category")}
          />
          <Group grow align="flex-end">
            <NumberInput
              label="Quantity"
              min={1}
              {...form.getInputProps("quantity")}
            />
            <NumberInput
              label="Weight (grams)"
              placeholder="e.g. 450"
              description="Optional"
              {...form.getInputProps("grams")}
            />
          </Group>
          <Group justify="flex-end" mt="sm">
            <Button variant="subtle" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" loading={createItem.isPending}>
              {item ? "Save changes" : "Add item"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
}
