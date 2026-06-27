import { usePackingList } from "$/frontend/packing-list/packing-list-context";
import { Button } from "@mantine/core";
import { CopyIcon, PlusIcon } from "@phosphor-icons/react";

export default function CallToAction() {
  const { editable } = usePackingList();

  return editable ? (
    <Button leftSection={<PlusIcon size={16} />} variant="default" size="md">
      Add section
    </Button>
  ) : (
    <Button leftSection={<CopyIcon size={16} />} size="md">
      Copy to my lists
    </Button>
  );
}
