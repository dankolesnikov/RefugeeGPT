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

const text = `
Certainly, here is the advice on how to protect yourself from a bomb:<br />
1. Assess the situation: Start by evaluating the risks associated with the specific situation to determine your course of action. Consider your location and the source of the threat.<br />
2. Protect against blast: Find a room with thick walls, if possible without windows. This could be a basement, the center of a building, or another space that provides additional protection from the blast and radiation.<br />
3. Protect against debris: Stay away from windows and doors to avoid falling glass and other debris that could be lethal in an explosion.<br />
4. Cover yourself: Wrap your body in a blanket, mattress, or other heavy material that can help protect you from debris and radiation.<br />
5. Protect your airways: Dampen a cloth with water and cover your nose and mouth to reduce the intake of dust and toxic substances.<br />
6. Stay informed: Follow the news or use a battery-powered radio to receive information about the situation and instructions on when it is safe to leave shelter.<br />
7. Be prepared for evacuation: Keep an emergency survival kit containing food, water, medications, clothing, and other essential items that may be needed after the explosion.`;

type OpenAISteamResponse = {
  id: string;
  object: string;
  create: number;
  model: string;
  choices: {
    delta: { content?: string; role?: string };
    index: number;
    finish_reason: any;
  }[];
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
  const onSubmit = handleSubmit((formData) => {
    if (isEmpty(formData.prompt)) {
      setError("prompt", { message: "Can not submit an empty message" });
      return;
    }
    const dataToSubmit = conversation.concat([
      {
        prompt: formData.prompt,
        message: text,
      },
    ]);
    localStorage.setItem("conversation", JSON.stringify(dataToSubmit));
    reset({ prompt: null });
    setConversation(dataToSubmit);
  });

  // const onSubmit = handleSubmit(async (formData) => {
  //   if (isEmpty(formData.prompt)) {
  //     setError("prompt", { message: "Can not submit an empty message" });
  //     return;
  //   }

  //   const response = await fetch("/api/getCompletion", {
  //     method: "POST",
  //     headers: {
  //       prompt: formData.prompt,
  //     },
  //   });
  //   const stream = response.body.getReader();
  //   let dataToSubmit;
  //   const decoder = new TextDecoder("utf-8");
  //   while (true) {
  //     const { value, done } = await stream.read();
  //     // console.log("newvalue", value);
  //     const responseRaw = decoder.decode(value);
  //     if (done || responseRaw === "data: [DONE]") break;
  //     // console.log(responseRaw === "[DONE]");
  //     // console.log("responseRaw", responseRaw, "lol");
  //     // console.log("parsed", JSON.parse(responseRaw.trim()));

  //     if (!isEmpty(responseRaw)) {
  //       let parsedResponse;
  //       try {
  //         parsedResponse = JSON.parse(responseRaw) as OpenAISteamResponse;
  //       } catch (e) {
  //         // console.log("e", responseRaw);
  //         console.log("end");
  //       }
  //       const newMessage: string | undefined =
  //         parsedResponse?.choices?.at(0).delta?.content;
  //       // const index = isEmpty(conversation) ? 0 : conversation.length + 1;
  //       // console.log(
  //       //   conversation.find((item) => item.index === index) === undefined
  //       //     ? newMessage
  //       //     : conversation
  //       //         .find((item) => item.index === index)
  //       //         .message.concat(newMessage)
  //       // );
  //       // // dataToSubmit = [
  //       //   {
  //       //     index,
  //       //     prompt: formData.prompt,
  //       //     message:
  //       //       conversation.find((item) => item.index === index) === undefined
  //       //         ? newMessage
  //       //         : conversation
  //       //             .find((item) => item.index === index)
  //       //             .message.concat(newMessage),
  //       //   },
  //       // ];
  //       // localStorage.setItem("conversation", JSON.stringify(dataToSubmit));
  //       // co
  //       console.log(
  //         "conversation.concat(newMessage)",
  //         conversation.concat(newMessage)
  //       );
  //       setConversation(conversation.concat(newMessage));
  //     }
  //   }
  //   reset({ prompt: null });
  //   stream.releaseLock();
  //   scrollIntoView();
  // });

  useHotkeys([["enter", () => onSubmit()]]);

  // const clearChat = () => {
  //   localStorage.clear();
  //   setConversation([]);
  // };

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
        // onClick={() => clearChat()}
        style={{ position: "fixed", bottom: 39, left: 1215, alignItems: "end" }}
      >
        <IconRefreshAlert />
      </ActionIcon>
    </Paper>
  );
};
export default Chat;
