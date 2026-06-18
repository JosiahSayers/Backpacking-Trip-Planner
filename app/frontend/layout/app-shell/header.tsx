import HeaderLinks from "$/frontend/layout/app-shell/header-links";
import { AppShellHeader, Group, Title } from "@mantine/core";

export default function Header() {
  return (
    <AppShellHeader>
      <Group px="md" justify="space-between">
        <Title>Summit Journal</Title>
        <HeaderLinks />
      </Group>
    </AppShellHeader>
  );
}
