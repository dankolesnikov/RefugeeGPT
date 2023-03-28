import type { NextRequest } from "next/server";
import { isEmpty } from "lodash";
import { OPENAI_API_KEY } from "../../utils/variables";
import { OpenAICompletionsPayload, models } from "../../utils/types";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const improvedPrompt = `I am a refugee experiencing a humanitarian crises. I need your help assisting with the folowing question: ${req.headers.get(
    "prompt"
  )}`;
  const payload: OpenAICompletionsPayload = {
    model: models.GPT3,
    messages: [{ role: "user", content: improvedPrompt }],
    temperature: 0,
    stream: true,
  };
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  const stream = res.body.getReader();
  const readable = new ReadableStream({
    async start(controller) {
      while (true) {
        const { value, done } = await stream.read();
        if (done) {
          break;
        } else {
          controller.enqueue(value);
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
