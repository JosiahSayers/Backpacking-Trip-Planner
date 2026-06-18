import { authClient } from "$/frontend/utils/auth-client";
import { Button, Group, Text } from "@mantine/core";

export default function HeaderLinks() {
  const session = authClient.useSession();

  if (session.data !== null) {
    return (
      <Group>
        <Text>Hello {session.data.user.name}</Text>
        <Button variant="subtle" onClick={() => authClient.signOut()}>
          Sign Out
        </Button>
      </Group>
    );
  }

  return (
    <Group>
      <Button variant="subtle" onClick={() => alert("Sign In clicked")}>
        Sign In
      </Button>
      <Button variant="subtle" onClick={() => alert("Register clicked")}>
        Register
      </Button>
    </Group>
  );
}
