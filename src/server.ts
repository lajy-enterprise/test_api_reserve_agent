import express from "express";
import { userRouter } from "./routes/user.route";
import { reserveRouter } from "./routes/reserve.route";
import bodyParser from "body-parser";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

import { app } from "./graph";
import { HumanMessage } from "@langchain/core/messages";

const PORT = process.env.PORT || 3000;
export const BASE_URL = "https://api-reserve-agent.onrender.com";

const serverExpress = express();
serverExpress.use(
  cors({
    origin: "https://client-agent-reserve.onrender.com",
    exposedHeaders: ["thread_id"],
  })
);
serverExpress.use(bodyParser.json());

serverExpress.use("/user", userRouter);
serverExpress.use("/reserve", reserveRouter);

serverExpress.post("/event", async (req, res) => {
  const { message, threadId } = req.body;
  console.log("/event", message, threadId);

  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);
  if (!threadId) {
    const thread_id = uuidv4();
    res.setHeader("thread_id", thread_id);
    const config = {
      configurable: { thread_id },
      streamMode: "values" as const,
    };

    for await (const event of await app.stream(
      {
        messages: [new HumanMessage(message)],
      },
      config
    )) {
      const recentMsg = event.messages[event.messages.length - 1];

      if (recentMsg._getType() === "ai") {
        if (recentMsg.tool_calls[0]?.name === "addReserveTurn") {
          res.write(JSON.stringify(recentMsg.tool_calls[0].args));
        }
        res.write(recentMsg.content);
      }
    }
  } else {
    const config = {
      configurable: { thread_id: threadId },
      streamMode: "values" as const,
    };

    for await (const event of await app.stream(
      {
        messages: [new HumanMessage(message)],
      },
      config
    )) {
      const recentMsg = event.messages[event.messages.length - 1];
      console.log("/event_continue_stream", recentMsg);

      if (recentMsg._getType() === "ai") {
        if (recentMsg.tool_calls[0]?.name === "addReserveTurn") {
          res.write(JSON.stringify(recentMsg.tool_calls[0].args));
        }
        res.write(recentMsg.content);
      }
    }
  }

  res.end();
  req.on("close", () => {
    console.log(` Connection closed`);
  });
});

serverExpress.post("/validate", async (req, res) => {
  const { send, threadId } = req.body;
  const config = {
    configurable: { thread_id: threadId },
    streamMode: "values" as const,
  };

  await app.updateState(config, { confirm: send });

  for await (const event of await app.stream(null, config)) {
    const recentMsg = event.messages[event.messages.length - 1];

    if (recentMsg._getType() === "ai") {
      if (recentMsg.tool_calls[0]?.name === "addReserveTurn") {
        recentMsg.tool_calls[0].args.confirm = send;
      }
      if (recentMsg.tool_calls.length === 0) {
        res.write(recentMsg.content);
      }
    }
  }

  res.end();
});

serverExpress.listen(PORT, () => {
  console.log(`Events listening at PORT: ${PORT}`);
});
