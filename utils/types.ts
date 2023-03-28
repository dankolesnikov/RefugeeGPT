export type Conversation = {
  id: string;
  prompt: string;
  message: string;
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
