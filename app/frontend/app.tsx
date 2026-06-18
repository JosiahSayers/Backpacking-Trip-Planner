import AppShell from "$/frontend/layout/app-shell";
import { trailTheme } from "$/frontend/theme";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

export default function App() {
  return (
    <>
      <ColorSchemeScript />
      <MantineProvider theme={trailTheme}>
        <AppShell />
      </MantineProvider>
    </>
  );
}
