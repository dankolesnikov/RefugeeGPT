import * as OpenAI from "../../services/openai";
import { OpenAICompletionsPayload, models } from "../../utils/types";
import { IS_DEV } from "../../utils/variables";

export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  const improvedPrompt = `I am a refugee experiencing a humanitarian crises. I need your help assisting with the folowing question: ${body.prompt}`;
  const payload: OpenAICompletionsPayload = {
    model: IS_DEV ? models.GPT3 : models.GPT4,
    messages: [{ role: "user", content: improvedPrompt }],
    temperature: 0.3,
    stream: false,
  };

  const response = await OpenAI.client.createChatCompletion(payload);
  if (response.status === 200) {
    res.status(200).json(response.data);
  } else {
    res.status(503);
  }
}
