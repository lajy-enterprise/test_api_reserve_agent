import { NodeInterrupt, StateGraph } from "@langchain/langgraph";
import StateAnnotation from "./state";
import { modelWithTools } from "./model";
import { MemorySaver } from "@langchain/langgraph";
import { AIMessage, SystemMessage } from "@langchain/core/messages";
import { consultDisponibilidad, addReserveTurnTool } from "./tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";

// export const graph = new StateGraph(StateAnnotation).compile();

const tools = [consultDisponibilidad, addReserveTurnTool];
const toolNodeForGraph = new ToolNode(tools);

async function callModel(state: typeof StateAnnotation.State) {
  const messages = state.messages;
  const systemsMessage = new SystemMessage(
    "Eres un poderoso asistente que reserva turnos para un gimnasio, recibes la solicitud del usuario, la procesas, para resolverla tienes varias herramientas a tu disposición; en primer lugar consultas la disponibilidad, y en base a ello continuas con la reserva del turno. "
  );

  const response = await modelWithTools.invoke([systemsMessage, ...messages]);

  // We return a list, because this will get added to the existing list
  return { messages: [response] };
}

// function callConsultaDisponibilidad

function checkToolCall(state: typeof StateAnnotation.State) {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  // Otherwise, we stop (reply to the user)
  return "__end__";
}

// Agregar datos de la reserva al estado cuando se confirma
// const confirmReserve = (state: typeof StateAnnotation.State) => {};

const workflow = new StateGraph(StateAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNodeForGraph)
  .addEdge("__start__", "agent")

  .addConditionalEdges("agent", checkToolCall, ["tools", "__end__"])
  .addEdge("tools", "agent");

const checkpointer = new MemorySaver();

export const app = workflow.compile({
  checkpointer,
  // interruptBefore: ["tools"],
});
