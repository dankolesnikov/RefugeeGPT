import { ActionIcon, Card, Group, Paper, TextInput } from "@mantine/core";
import { useHotkeys, useScrollIntoView } from "@mantine/hooks";
import { IconRefreshAlert, IconSend } from "@tabler/icons-react";
import { isEmpty } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Conversation, OpenAIResponse, ResponseStatus } from "../utils/types";

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

type FormData = {
  prompt: string;
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

  // const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
  //   offset: 60,
  // });

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
        const parsedResponse = parseGetCompletionResult(responseRaw);

        switch (parsedResponse.status) {
          case ResponseStatus.Suceeded:
            try {
              setConversation((prevState) => {
                const id = parsedResponse.data.id;
                const index = prevState.findIndex((item) => item.id === id);
                const message = parsedResponse.data.choices[0].delta.content;

                if (index === -1) {
                  // first word of the message
                  return [
                    ...prevState,
                    {
                      id,
                      prompt,
                      message,
                    },
                  ];
                } else {
                  // update exisitng message
                  const currentMessage = prevState[index].message;
                  const dataWithoutCurrentConvo = prevState.filter(
                    (item) => item.id !== id
                  );
                  return [
                    ...dataWithoutCurrentConvo,
                    {
                      id,
                      prompt,
                      message: currentMessage.concat(message),
                    },
                  ];
                }
              });
            } catch {
              console.log("error in suceeded");
              console.log(parsedResponse);
            }
          case ResponseStatus.Finished:
            break;
          case ResponseStatus.Failed:
            console.log("Failed to parse:");
            console.log(parsedResponse.data);
          case ResponseStatus.Unrelated:
            console.log("Unrelated");
          default:
            console.log("whats wrong");
        }
      }
      stream.releaseLock();
      // localStorage.setItem("conversation", JSON.stringify(conversation));
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
    // scrollIntoView();
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
      {/* <div ref={targetRef} style={{ paddingBottom: "200px" }} /> */}

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
