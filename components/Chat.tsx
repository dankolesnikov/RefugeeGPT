// CreateChatCompletionResponse

import { ActionIcon, Card, Group, Paper, TextInput } from "@mantine/core";
import { useHotkeys, useScrollIntoView } from "@mantine/hooks";
import { IconRefreshAlert, IconSend } from "@tabler/icons-react";
import { isEmpty } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Conversation, OpenAIResponse, ResponseStatus } from "../utils/types";
import { CreateChatCompletionResponse } from "openai";
import { PuffLoader, ScaleLoader, SyncLoader } from "react-spinners";

type FormData = {
  prompt: string;
};

const Chat = () => {
  const [conversation, setConversation] = useState([] as Conversation[]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormData>();

  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });

  const getCompletionsCallback = useCallback(
    async (prompt: string) => {
      setLoading(true);
      setConversation((prevState) => [
        ...prevState,
        {
          prompt,
          isPending: true,
        },
      ]);
      const response = await fetch("/api/getCompletion", {
        method: "POST",
        body: JSON.stringify(prompt),
        headers: {
          prompt: prompt,
        },
      });
      const data: CreateChatCompletionResponse = await response.json();
      setLoading(false);

      setConversation((prevState) => {
        return prevState.map((item) => {
          if (item.isPending) {
            return {
              id: data.id,
              prompt: item.prompt,
              message: data.choices[0].message.content,
              isPending: false,
            };
          }
          return item;
        });
      });
    },
    [conversation]
  );

  const onSubmit = handleSubmit(async (formData) => {
    if (isEmpty(formData.prompt)) {
      setError("prompt", { message: "Can not submit an empty message" });
      return;
    }
    await getCompletionsCallback(formData.prompt);
    reset({ prompt: null });
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
      <div>
        {conversation.map((item, i) => {
          return (
            <Card key={i} style={{ marginBottom: "10px" }}>
              <Card.Section>
                <b>{item.prompt}</b>
              </Card.Section>
              <Card.Section>
                {item.isPending ? (
                  <ScaleLoader
                    color="#202425"
                    height={"20px"}
                    style={{ paddingTop: "5px" }}
                  />
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.message,
                    }}
                  />
                )}
              </Card.Section>
            </Card>
          );
        })}
      </div>
      <div ref={targetRef} style={{ paddingBottom: "200px" }} />

      <form onSubmit={onSubmit}>
        <Group
          style={{
            position: "fixed",
            bottom: 30,
            width: "70%",
          }}
        >
          <TextInput
            style={{ width: "inherit" }}
            name="prompt"
            disabled={loading}
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
            icon={
              loading ? (
                <PuffLoader color="#202425" size={15} />
              ) : (
                <IconSend size="22px" onClick={() => onSubmit()} />
              )
            }
          />
          <ActionIcon onClick={() => clearChat()}>
            <IconRefreshAlert />
          </ActionIcon>
        </Group>
      </form>
    </Paper>
  );
};
export default Chat;
