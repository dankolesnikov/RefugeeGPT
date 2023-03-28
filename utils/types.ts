import { ChatCompletionRequestMessage } from "openai";

export type Conversation = {
  id?: string;
  prompt: string;
  message?: string;
  isPending: boolean;
};

export type OpenAISteamResponseContent = {
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

export enum ResponseStatus {
  Suceeded,
  Failed,
  Finished,
  Unrelated,
}

export type OpenAIResponse =
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

export type html = string;

export type OpenAICompletionsPayload = {
  model: string;
  prompt?: string;
  messages: Array<ChatCompletionRequestMessage>; //{ role: string; content: string }[];
  temperature: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
  n?: number;
};

export enum models {
  GPT4 = "gpt-4",
  GPT3 = "gpt-3.5-turbo",
}
