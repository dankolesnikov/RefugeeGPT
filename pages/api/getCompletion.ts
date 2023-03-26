import type { NextRequest } from "next/server";
import { isEmpty } from "lodash";

export const config = {
  runtime: "edge",
};

interface OpenAICompletionsPayload {
  model: string;
  prompt?: string;
  messages: { role: string; content: string }[];
  temperature: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
  n?: number;
}

enum models {
  GPT4 = "gpt-4",
  GPT3 = "gpt-3.5-turbo",
}

export default async function handler(req: NextRequest) {
  const improvedPrompt = `I am a refugee experiencing a humanitarian crises. I need your help assisting with the folowing question: ${req.headers.get(
    "prompt"
  )}`;
  const payload: OpenAICompletionsPayload = {
    model: models.GPT4,
    messages: [{ role: "user", content: improvedPrompt }],
    temperature: 0,
    stream: true,
  };
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  const stream = res.body.getReader();
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      while (true) {
        const { value, done } = await stream.read();
        const response = new TextDecoder().decode(value);
        if (done || response === "[DONE]" || isEmpty(response)) break;
        console.log("sending", response.slice(6));
        controller.enqueue(encoder.encode(response.slice(6)));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
