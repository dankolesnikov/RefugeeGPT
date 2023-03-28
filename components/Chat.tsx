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
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHotkeys, useScrollIntoView } from "@mantine/hooks";
import { isEmpty, isUndefined } from "lodash";
import { IconRefreshAlert } from "@tabler/icons-react";

type Conversation = {
  prompt: string;
  message: string;
};

const text = `
Certainly, here is the advice on how to protect yourself from a bomb:<br />
1. Assess the situation: Start by evaluating the risks associated with the specific situation to determine your course of action. Consider your location and the source of the threat.<br />
2. Protect against blast: Find a room with thick walls, if possible without windows. This could be a basement, the center of a building, or another space that provides additional protection from the blast and radiation.<br />
3. Protect against debris: Stay away from windows and doors to avoid falling glass and other debris that could be lethal in an explosion.<br />
4. Cover yourself: Wrap your body in a blanket, mattress, or other heavy material that can help protect you from debris and radiation.<br />
5. Protect your airways: Dampen a cloth with water and cover your nose and mouth to reduce the intake of dust and toxic substances.<br />
6. Stay informed: Follow the news or use a battery-powered radio to receive information about the situation and instructions on when it is safe to leave shelter.<br />
7. Be prepared for evacuation: Keep an emergency survival kit containing food, water, medications, clothing, and other essential items that may be needed after the explosion.`;

type OpenAISteamResponseContent = {
  id: string;
  object: string;
  create: number;
  model?: string;
  choices: {
    delta?: { content?: string; role?: string };
    index?: number;
    finish_reason?: any;
  }[];
};
enum ResponseStatus {
  Suceeded,
  Failed,
  Finished,
  Unrelated,
}

type OpenAIResponse =
  | {
      data: OpenAISteamResponseContent;
      status: ResponseStatus.Suceeded;
    }
  | {
      data: null;
      status: ResponseStatus.Finished;
    }
  | {
      data: null;
      status: ResponseStatus.Unrelated;
    }
  | {
      data: any;
      error: Error;
      status: ResponseStatus.Failed;
    };

type FormData = {
  prompt: string;
};

type html = string;

const parseGetCompletionResult = (input: string): OpenAIResponse => {
  const temp = input.replace("data", `"data"`);
  if (input.includes("DONE")) {
    return {
      data: null,
      status: ResponseStatus.Finished,
    };
  }
  const updatedString = `{${temp}}`;
  try {
    const responseInJson1 = JSON.parse(updatedString);
    if (isEmpty(responseInJson1.data.choices[0].delta.content)) {
      return {
        data: null,
        status: ResponseStatus.Unrelated,
      };
    }
    // if (responseInJson1.data.choices[0].delta.role === "assistant") {
    //   console.log("assistant");
    // }
    return {
      data: responseInJson1.data,
      status: ResponseStatus.Suceeded,
    };
  } catch (e) {
    return {
      data: updatedString,
      error: e,
      status: ResponseStatus.Failed,
    };
  }
};

const Chat = () => {
  const [conversation, setConversation] = useState([] as Conversation[]);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormData>();

  // if (typeof window !== "undefined") {
  //   const dataFromLocalStorage = localStorage.getItem("conversation");
  //   useEffect(
  //     () =>
  //       setConversation(
  //         (JSON.parse(dataFromLocalStorage) as Conversation[]) ?? []
  //       ),
  //     [dataFromLocalStorage]
  //   );
  // }

  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });

  const getCompletionsCallback = useCallback(
    async (prompt: string) => {
      const response = await fetch("/api/getCompletion", {
        method: "POST",
        headers: {
          prompt: prompt,
        },
      });
      const stream = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      while (true) {
        const { value, done } = await stream.read();
        if (done) break;
        const responseRaw = decoder.decode(value);
        console.log("packet", responseRaw);
        const parsedResponse = parseGetCompletionResult(responseRaw);

        switch (parsedResponse.status) {
          case ResponseStatus.Suceeded:
            try {
              setConversation((prevState) => {
                const index = prevState.findIndex(
                  (item) => item.prompt === prompt
                );
                const message = parsedResponse.data.choices[0].delta.content;

                if (isUndefined(index)) {
                  // first word of the message
                  return [
                    ...prevState,
                    {
                      prompt,
                      message,
                    },
                  ];
                } else {
                  // update exisitng message
                  const currentMessage = prevState[index].message;
                  const dataWithoutCurrentConvo = prevState.filter(
                    (_, idx) => idx !== index
                  );
                  return [
                    ...dataWithoutCurrentConvo,
                    {
                      prompt,
                      message: currentMessage.concat(message),
                    },
                  ];
                }
                // .message.concat(parsedResponse.data.choices[0].delta.content);
              });
              return;
            } catch {
              console.log("error in suceeded");
              console.log(parsedResponse);
            }
          case ResponseStatus.Finished:
            break;
          case ResponseStatus.Failed:
            console.log("Failed to parse:");
            console.error(parsedResponse.data);
          case ResponseStatus.Unrelated:
            console.log("Unrelated");
          default:
            console.log("whats wrong");
        }
      }
      stream.releaseLock();
    },
    [conversation]
  );

  const onSubmit = handleSubmit(async (formData) => {
    if (isEmpty(formData.prompt)) {
      setError("prompt", { message: "Can not submit an empty message" });
      return;
    }
    getCompletionsCallback(formData.prompt);
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
        {/* <Card style={{ marginBottom: "10px" }}>
          <Card.Section>
            <b>{}</b>
          </Card.Section>
          <Card.Section>
            <div
              dangerouslySetInnerHTML={{
                __html: conversation,
              }}
            />
          </Card.Section>
        </Card> */}

        {conversation.map((item, i) => {
          return (
            <Card key={i} style={{ marginBottom: "10px" }}>
              <Card.Section>
                <b>{}</b>
              </Card.Section>
              <Card.Section>
                <div
                  dangerouslySetInnerHTML={{
                    __html: item.message,
                  }}
                />
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
            width: "60%",
          }}
        >
          <TextInput
            style={{ width: "inherit" }}
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
          <ActionIcon onClick={() => clearChat()}>
            <IconRefreshAlert />
          </ActionIcon>
        </Group>
      </form>
    </Paper>
  );
};
export default Chat;
