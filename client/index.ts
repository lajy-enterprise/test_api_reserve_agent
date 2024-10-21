import { Client } from "@langchain/langgraph-sdk";

const client = new Client({
  apiKey: "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",
  apiUrl: "http://localhost:3000/start",
});
// Using the graph deployed with the name "agent"
const assistantId = "agent";
// const thread = await client.threads.create();
// const agent = await client.assistants.get("agent");
console.log(client);
