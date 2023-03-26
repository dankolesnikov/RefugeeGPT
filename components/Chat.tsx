import {
  TextInput,
  Paper,
  Card,
  Group,
  Stack,
  ScrollArea,
  Overlay,
  Button,
  ActionIcon,
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHotkeys, useScrollIntoView } from "@mantine/hooks";
import { isEmpty } from "lodash";
import { IconRefreshAlert } from "@tabler/icons-react";

type Conversation = {
  prompt: string;
  message: string;
};

type FormData = {
  prompt: string;
};

type html = string;

const Chat = () => {
  const [conversation, setConversation] = useState([] as Conversation[]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormData>();

  if (typeof window !== "undefined") {
    const dataFromLocalStorage = localStorage.getItem("conversation");
    useEffect(
      () =>
        setConversation(
          (JSON.parse(dataFromLocalStorage) as Conversation[]) ?? []
        ),
      [dataFromLocalStorage]
    );
  }

  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });

  const onSubmit = handleSubmit(async (formData) => {
    if (isEmpty(formData.prompt)) {
      setError("prompt", { message: "Can not submit an empty message" });
      return;
    }

    const response = await fetch("/api/getCompletion", {
      method: "POST",
      headers: {
        prompt: formData.prompt,
      },
    });
    const output: { message: html } = await response.json();
    console.log(output);
    const dataToSubmit = conversation.concat([
      {
        prompt: formData.prompt,
        message: output.message,
      },
    ]);
    localStorage.setItem("conversation", JSON.stringify(dataToSubmit));
    reset({ prompt: null });
    setConversation(dataToSubmit);
    scrollIntoView();
  });

  useHotkeys([["enter", () => onSubmit()]]);

  const clearChat = () => {
    localStorage.clear();
    setConversation([]);
  };

  return (
    <Paper
      shadow="sm"
      p="lg"
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <div style={{ paddingBottom: "50px" }}>
        {conversation.map((item, i) => {
          return (
            <Card key={i} style={{ marginBottom: "10px" }}>
              <Card.Section>
                <b>{item.prompt}</b>
              </Card.Section>
              <Card.Section>
                <div
                  dangerouslySetInnerHTML={{
                    __html: item.message.replace(/\n/g, "<br />"),
                  }}
                />
              </Card.Section>
            </Card>
          );
        })}
      </div>
      <div ref={targetRef} />

      <form onSubmit={onSubmit}>
        <TextInput
          style={{
            position: "fixed",
            bottom: 30,
            width: "60%",
          }}
          name="prompt"
          {...register("prompt")}
          error={errors.prompt?.message}
          styles={() => ({
            root: {
              color: "dark",
            },
            input: {
              height: 45,
            },
          })}
          placeholder="How can I help?"
          icon={<IconSend size="22px" onClick={() => onSubmit()} />}
        />
      </form>
      <ActionIcon
        onClick={() => clearChat()}
        style={{ position: "fixed", bottom: 39, left: 1215, alignItems: "end" }}
      >
        <IconRefreshAlert />
      </ActionIcon>
    </Paper>
  );
};
export default Chat;
