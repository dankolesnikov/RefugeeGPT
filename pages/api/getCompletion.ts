import type { NextRequest } from "next/server";

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
    // prompt: improvedPrompt,
    temperature: 0,
    stream: false,
  };
  console.log(payload);
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  let message;
  try {
    message = data.choices[0].message.content;
  } catch (e) {
    console.error(e);
    console.error(data);
    message = "I failed.";
  }
  return new Response(JSON.stringify({ message }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}
