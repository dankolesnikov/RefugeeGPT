import * as OpenAI from "../../services/openai";
import { OpenAICompletionsPayload, models } from "../../utils/types";

export default async function handler(req, res) {
  console.log(req.body);
  //   const improvedPrompt = `I am a refugee experiencing a humanitarian crises. I need your help assisting with the folowing question: ${req.headers.get(
  //     "prompt"
  //   )}`;
  const improvedPrompt = "how are you?";
  const payload: OpenAICompletionsPayload = {
    model: models.GPT3,
    messages: [{ role: "user", content: improvedPrompt }],
    temperature: 0.3,
    stream: false,
  };

  const response = await OpenAI.client.createChatCompletion(payload);
  if (response.status === 200) {
    console.log(response.data);
    res.status(200).json(response.data);
  } else {
    res.status(503);
  }
}
