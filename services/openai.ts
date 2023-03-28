import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "../utils/variables";

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
export const client = new OpenAIApi(configuration);
