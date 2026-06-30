import { Button, Group, Modal, Text } from "@mantine/core";
import type { ReactNode } from "react";

interface Props {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
}

export default function ConfirmDeleteModal({
  opened,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel = "Delete",
}: Props) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={title} size="sm" centered>
      <Text c="dimmed" mb="xl" size="sm">
        {children}
      </Text>

      <Group justify="flex-end">
        <Button variant="subtle" onClick={onClose}>
          Cancel
        </Button>
        <Button color="red" onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </Group>
    </Modal>
  );
}
