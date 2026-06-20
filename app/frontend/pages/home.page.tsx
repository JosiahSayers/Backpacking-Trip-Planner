import AppLink from "$/frontend/app-link";
import {
  Box,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { Link } from "wouter";

const features = [
  {
    label: "Gear",
    title: "Your kit, catalogued",
    description:
      "Build a personal inventory of everything you own. Weight, category, condition — it's all there when you need it. No more wondering if you packed the rain cover.",
    icon: "◈",
    color: "trail-green",
  },
  {
    label: "Lists",
    title: "Pack lists that actually fit",
    description:
      "Create packing lists from scratch or start from a community template and make it yours. Every trip is different — your list should be too.",
    icon: "◧",
    color: "bark-brown",
  },
  {
    label: "Trips",
    title: "Share where you're headed",
    description:
      "Log your route, dates, and trailhead details in one place. Share a link with people back home so they always know where you are and when to expect you back.",
    icon: "◉",
    color: "trail-green",
  },
] as const;

export default function HomePage() {
  return (
    <Box>
      <Box
        style={{
          background:
            "linear-gradient(150deg, var(--mantine-color-trail-green-8) 0%, var(--mantine-color-trail-green-6) 60%, var(--mantine-color-bark-brown-6) 100%)",
          margin: "calc(-1 * var(--mantine-spacing-md))",
          padding: `calc(var(--mantine-spacing-xl) * 2) var(--mantine-spacing-md)`,
        }}
      >
        <Container size="md">
          <Stack gap="xl">
            <Stack gap="md">
              <Title
                order={1}
                style={{
                  fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                  color: "var(--mantine-color-white)",
                  lineHeight: 1.15,
                }}
              >
                Plan your adventure.
                <br />
                Pack with purpose.
              </Title>
              <Text
                size="lg"
                style={{ color: "var(--mantine-color-trail-green-1)" }}
                maw={540}
              >
                Summit Journal is a backpacking planner that keeps your gear
                organised, your lists dialled in, and the people back home
                informed about your whereabouts.
              </Text>
            </Stack>
            <Group>
              <Button
                component={Link}
                href="/register"
                size="md"
                color="white"
                c="trail-green.8"
              >
                Get started
              </Button>
              <Button
                component={Link}
                href="/sign-in"
                size="md"
                variant="outline"
                color="white"
              >
                Sign in
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      <Container size="md" py="xl" mt="xl">
        <Stack gap="xl">
          <Stack gap="xs" ta="center">
            <Title order={2}>Everything your trip needs, in one place</Title>
            <Text c="dimmed" size="md" maw={480} mx="auto">
              From the gear room to the trailhead, Summit Journal covers the
              planning side so you can focus on the miles.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
            {features.map((f) => (
              <Card key={f.title} withBorder shadow="sm">
                <Stack gap="sm">
                  <Group gap="xs" align="center">
                    <ThemeIcon
                      color={f.color}
                      variant="light"
                      size="lg"
                      radius="sm"
                      style={{ fontSize: "1.1rem" }}
                    >
                      {f.icon}
                    </ThemeIcon>
                    <Text
                      size="xs"
                      tt="uppercase"
                      fw={700}
                      c={`${f.color}.6`}
                      style={{ letterSpacing: "0.08em" }}
                    >
                      {f.label}
                    </Text>
                  </Group>
                  <Title order={3} size="h4">
                    {f.title}
                  </Title>
                  <Text size="sm" c="dimmed" lh="md">
                    {f.description}
                  </Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      <Box
        style={{
          background: "var(--mantine-color-stone-gray-0)",
          borderTop: "1px solid var(--mantine-color-stone-gray-2)",
        }}
        mt="xl"
        py="xl"
      >
        <Container size="md">
          <Stack align="center" gap="md" ta="center">
            <Title order={3}>Ready to start planning?</Title>
            <Text c="dimmed" maw={400}>
              Create a free account and have your first trip planned before the
              weekend.
            </Text>
            <Group>
              <Button component={Link} href="/register" size="md">
                Create an account
              </Button>
              <AppLink href="/sign-in">Already have an account</AppLink>
            </Group>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
