import { TextInput, Paper, Card, Group } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHotkeys } from "@mantine/hooks";

type Conversation = {
  prompt: string;
  message: string;
};

type FormData = {
  prompt: string;
};

const Chat = () => {
  const [conversation, setConversation] = useState([] as Conversation[]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  if (typeof window !== "undefined") {
    useEffect(() =>
      setConversation(
        (JSON.parse(localStorage.getItem("conversation")) as Conversation[]) ??
          []
      )
    );
  }

  const onSubmit = handleSubmit((formData) => {
    const dataToSubmit = conversation.concat([
      {
        prompt: formData.prompt,
        message: "cool",
      },
    ]);
    localStorage.setItem("conversation", JSON.stringify(dataToSubmit));
    setConversation(dataToSubmit);
    
  });

  useHotkeys([["enter", () => onSubmit()]]);

  return (
    <Paper shadow="sm" p="lg" style={{ height: "100%", position: "relative" }}>
      {conversation.map((item) => {
        return (
          <Card>
            <Card.Section>Prompt: {item.prompt}</Card.Section>
            <Card.Section>{item.message}</Card.Section>
          </Card>
        );
      })}

      <form onSubmit={onSubmit}>
        <TextInput
          {...register}
          style={{
            position: "absolute",
            bottom: 10,
            width: "800px",
          }}
          styles={() => ({
            root: {
              color: "dark",
            },
            input: {
              height: 45,
            },
          })}
          icon={<IconSend size="22px" />}
        />
      </form>
    </Paper>
  );
};
export default Chat;
