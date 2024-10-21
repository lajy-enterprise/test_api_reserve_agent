import { Client } from "@langchain/langgraph-sdk";
// import { logMessageEvent } from "utils.js";

const client = new Client({
  apiKey: process.env.LANGCHAIN_API_KEY,
  apiUrl: "http://localhost:3000",
});

const thread = await client.threads.create();
const threadId = thread.thread_id;
console.log(threadId);
