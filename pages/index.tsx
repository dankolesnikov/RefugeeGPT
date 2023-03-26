import { Button, Group, Title } from "@mantine/core";
import { AppShell, Navbar, Header } from "@mantine/core";
import { IconMedicalCross, IconMessages } from "@tabler/icons-react";
import { IconBook } from "@tabler/icons-react";
import Chat from "../components/Chat";

const HomePage = () => {
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 250 }} p="xs">
          {/* Navbar content */}
          <Group spacing="xs" position={"left"}>
            <Button leftIcon={<IconMessages />} variant="subtle" color="dark">
              Chat
            </Button>
            <Button
              leftIcon={<IconMedicalCross />}
              variant="subtle"
              color="dark"
            >
              Refugee Resources
            </Button>
          </Group>
          <Button
            style={{
              position: "absolute",
              bottom: 10,
            }}
            leftIcon={<IconBook />}
            variant="subtle"
            color="dark"
          >
            Manifesto
          </Button>
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          {/* Header content */}
          <Title>
            RefugeeGPT - AI Assistant to help refugees during crises
          </Title>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Chat />
    </AppShell>
  );
};

export default HomePage;
