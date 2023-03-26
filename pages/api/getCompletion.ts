import type { NextRequest } from "next/server";
import { Configuration, OpenAIApi } from "openai";

export const config = {
  runtime: "edge",
};

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextRequest) {
  const openai = new OpenAIApi(configuration);
  const response = await openai.listModels();
  return new Response(JSON.stringify({ data: response.data.data }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}
