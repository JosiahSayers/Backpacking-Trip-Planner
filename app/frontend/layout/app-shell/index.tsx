import Header from "$/frontend/layout/app-shell/header";
import { AppShellMain, AppShell as MantineShell, Text } from "@mantine/core";

export default function AppShell() {
  return (
    <MantineShell padding="md" header={{ height: 60 }}>
      <Header />

      <AppShellMain>
        <Text>This is where the main content will be</Text>
      </AppShellMain>
    </MantineShell>
  );
}
