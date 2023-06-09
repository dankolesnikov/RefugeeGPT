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
import { useMediaQuery } from "@mantine/hooks";

const HomePage = () => {
  const [opened, setOpened] = useState(false);
  const mobileWidth = useMediaQuery("(max-width: 390px)");
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
              disabled
              leftIcon={<IconMessages />}
              variant="subtle"
              color="dark"
            >
              Chat Streaming
            </Button>
            <Button
              leftIcon={<IconMedicalCross />}
              variant="subtle"
              color="dark"
              disabled
            >
              Refugee Resources
            </Button>
          </Stack>
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
            <Text size={mobileWidth === true ? "14px" : "xl"}>
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
