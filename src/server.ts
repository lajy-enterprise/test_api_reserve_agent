import { Elysia, t } from "elysia";
import express from "express";
import { userRouter } from "./routes/user.route";
import { reserveRouter } from "./routes/reserve.route";
import bodyParser from "body-parser";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { app } from "./graph";
import { HumanMessage, ToolMessage } from "@langchain/core/messages";

const serverExpress = express();
serverExpress.use(
  cors({
    exposedHeaders: ["thread_id"],
  })
);
serverExpress.use(bodyParser.json());
// serverExpress.use(bodyParser.urlencoded({ extended: false }));
serverExpress.use("/user", userRouter);
serverExpress.use("/reserve", reserveRouter);

serverExpress.post("/event", async (req, res) => {
  const { message, threadId } = req.body;
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
      console.log("--------" + recentMsg._getType() + "--------");
      console.log(recentMsg);
      console.log("--------------------");

      if (recentMsg._getType() === "ai") {
        if (recentMsg.tool_calls[0]?.name === "addReserveTurn") {
          recentMsg.tool_calls[0].args.confirm = true;
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
      console.log("--------" + recentMsg._getType() + "--------");
      console.log(recentMsg);
      console.log("--------------------");

      if (recentMsg._getType() === "ai") {
        if (recentMsg.tool_calls[0]?.name === "addReserveTurn") {
          recentMsg.tool_calls[0].args.confirm = true;
          res.write(JSON.stringify(recentMsg.tool_calls[0].args));
        }
        res.write(recentMsg.content);
      }
    }
  }

  // const result = app.streamEvents(
  //   {
  //     messages: [new HumanMessage(message)],
  //   },
  //   { configurable: { thread_id }, version: "v2" }
  // );
  // const reader = result.getReader();
  // res.setHeader("Thread-id", thread_id);
  // res.setHeader("Access-Control-Expose-Headers", "Thread-id");

  // let done, value;
  // while (!done) {
  //   // Leer cada chunk del stream
  //   ({ done, value } = await reader.read());

  //   // if (done) {
  //   //   // Si estoy escuchando con events.onmessage desde el front colocar 'data: [DONE]\n\n'
  //   //   console.log("DONE");

  //   //   break;
  //   // }

  //   const chunk = value?.data?.chunk?.content || "[No chunk content]";
  //   // console.log("value: " + JSON.stringify(value));
  //   // console.log(`Recibiendo chunk: ${chunk}`);
  //   if (chunk !== "[No chunk content]") {
  //     // Si estoy escuchando con events.onmessage desde el front colocar 'data: ${chunk}\n\n'
  //     res.write(`${chunk}`);
  //   }
  // }

  // state.values.messages[1].kwargs.tool_call_chunks[0].args;

  res.end();
  req.on("close", () => {
    console.log(` Connection closed`);
  });

  // for await (const event of result) {
  //   console.log(event.data.chunk.content);

  //   res.send(`data: ${event.data.chunk.content}\n\n`);
  // }
  // req.on("close", () => {
  //   console.log(` Connection closed`);
  // });
});

serverExpress.post("/validate", async (req, res) => {
  const { send, threadId, args } = req.body;
  const config = {
    configurable: { thread_id: threadId },
    streamMode: "values" as const,
  };
  if (send) {
    await app.updateState(config, { resrveDetails: args });
    const currentState = await app.getState(config);
    console.log("----------------------");

    console.log("Current State: " + JSON.stringify(currentState.values));
    console.log("----------------------");

    for await (const event of await app.stream(null, config)) {
      console.log(event.messages[event.messages.length - 1]);
      const recentMsg = event.messages[event.messages.length - 1];
      if (recentMsg._getType() === "ai") {
        if (recentMsg.tool_calls.length === 0) {
          res.write(recentMsg.content);
        }
      }
    }
  }
  res.end();
  //     const recentMsg = event.messages[event.messages.length - 1];
  //     console.log("--------" + recentMsg._getType() + "--------");
  //     console.log(recentMsg);
  //     console.log("--------------------");

  //     if (recentMsg._getType() === "ai") {
  //       if (
  //         recentMsg.tool_calls[0]?.name === "reservacion_de_turno_para_crossfit"
  //       ) {
  //         recentMsg.tool_calls[0].args.confirm = true;
  //         res.write(JSON.stringify(recentMsg.tool_calls[0].args));
  //       }
  //       res.write(recentMsg.content);
  //     }
  //   }
  // }
  // res.end();
});

serverExpress.listen(3000, () => {
  console.log(`Events listening at http://localhost:3000`);
});
// export const server = new Elysia()
//   .post("/start", async () => {
//     const thread_id = uuidv4();
//     const result = app.streamEvents(
//       {
//         messages: [new HumanMessage("Hola soy Mariano como estas?")],
//       },
//       { configurable: { thread_id }, version: "v2" }
//     );

//     return {
//       result: result,
//     };
//   })
//   .post(
//     "/message/:id",
//     async ({ body: { message }, params: { id } }) => {
//       console.log("ruta message" + id);

//       const config = { configurable: { thread_id: id } };
//       await app.updateState(config, { messages: [message] }); //add `asNode: "wait_for_input"` to update as a graph node

//       return {
//         state: await app.getState(config),
//         id,
//       };
//     },
//     {
//       body: t.Object({
//         message: t.String(),
//       }),
//     }
//   )
//   .get("/message/:id", async ({ params: { id } }) => {
//     const config = { configurable: { thread_id: id } };

//     return {
//       state: await app.getState(config),
//       id,
//     };
//   })
//   .post("/conversation/:id", async ({ body, params: { id } }) => {
//     const { message } = body as { message: string };
//     const config = { configurable: { thread_id: id } };

//     const result = await app.invoke(
//       {
//         messages: [new HumanMessage(message)],
//       },
//       config
//     );
//     return {
//       state: result,
//       id,
//     };
//   });
