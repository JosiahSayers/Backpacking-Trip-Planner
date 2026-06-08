import { trailTheme } from "$/frontend/theme";
import {
  Badge,
  ColorSchemeScript,
  MantineProvider,
  Title,
} from "@mantine/core";
import "@mantine/core/styles.css";

export default function App() {
  return (
    <>
      <ColorSchemeScript />
      <MantineProvider theme={trailTheme}>
        <Title>Summit Journal</Title>
        <Badge>Active</Badge>
      </MantineProvider>
    </>
  );
}
