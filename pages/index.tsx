import {
  AppShell,
  Burger,
  Button,
  Header,
  MediaQuery,
  Navbar,
  Stack,
  Text,
} from "@mantine/core";
import { IconMedicalCross, IconMessages } from "@tabler/icons-react";
import { useState } from "react";

import Chat from "../components/Chat";

// import { IconBook } from "@tabler/icons-react";
const HomePage = () => {
  const [opened, setOpened] = useState(false);
  console.log(process.env.OPENAI_KEY);

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <Stack spacing="xs" align="start">
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
          </Stack>
          {/* <Button
            style={{
              position: "absolute",
              bottom: 10,
            }}
            leftIcon={<IconBook />}
            variant="subtle"
            color="dark"
          >
            Manifesto
          </Button> */}
        </Navbar>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color="gray"
                mr="xl"
              />
            </MediaQuery>
            <Text size="xl">
              RefugeeGPT - AI Assistant to help refugees during crises
            </Text>
          </div>
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
