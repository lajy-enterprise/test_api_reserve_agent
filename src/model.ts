import { reserveTurnToCrossfit, consultDisponibilidad } from "./tools";
import { ChatOpenAI } from "@langchain/openai";

const tools = [reserveTurnToCrossfit, consultDisponibilidad];

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const modelWithTools = new ChatOpenAI({
  model: "gpt-4o",
  openAIApiKey: OPENAI_API_KEY,
  temperature: 0.5,
}).bindTools(tools);
