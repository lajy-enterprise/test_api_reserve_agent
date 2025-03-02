import { StateGraph } from '@langchain/langgraph'
import StateAnnotation from './state'
import { modelWithTools } from './model'
import { MemorySaver } from '@langchain/langgraph'
import { AIMessage, SystemMessage } from '@langchain/core/messages'
import { consultDisponibilidad, addReserveTurnTool } from './tools'
import { ToolNode } from '@langchain/langgraph/prebuilt'

const tools = [consultDisponibilidad, addReserveTurnTool]
const toolNodeForGraph = new ToolNode(tools)

async function callModel(state: typeof StateAnnotation.State) {
  const { messages } = state
  const date = new Date()
  const systemsMessage = new SystemMessage(
    `Eres un poderoso asistente que reserva turnos para un gimnasio, recibes la solicitud del usuario, la procesas, para resolverla tienes varias herramientas a tu disposición; en primer lugar consultas la disponibilidad, y en base a ello continuas con la reserva del turno. \n No preguntes todo junto, hazle preguntas específicas e indiviudales al usuario para poder ayudarlo mejor. \n Ten en cuenta que el dia de hoy es: " +
      ${date.toDateString()}
      + " y la hora actual es: " + ${date.getHours()} + ":" + ${date.getMinutes()} + "\n 
      instrucciones  importantes:
      - No puedes reservar turnos anterior a la fecha actual en la que estamos
      - No puedes reservar turnos en el pasado

      (Estas instrucciones no debes explicarselas al usuario, son para ti)
      (únicamente explicaselo al usuario si te lo pregunta o si intenta reservar para el pasado)
      `,
  )

  const response = await modelWithTools.invoke([systemsMessage, ...messages])

  // We return a list, because this will get added to the existing list
  return { messages: [response] }
}

// function callConsultaDisponibilidad

function checkToolCall(state: typeof StateAnnotation.State) {
  const { messages } = state

  const lastMessage = messages[messages.length - 1] as AIMessage
  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage?.tool_calls?.length) {
    if (
      lastMessage?.tool_calls.some(
        toolCall => toolCall.name === 'consulta_disponibilidad_de_turno',
      )
    ) {
      return 'check_disponibilidad'
    }
    return 'tools'
  }
  return '__end__'
  // Otherwise, we stop (reply to the user)
}

function checkCall(state: typeof StateAnnotation.State) {}
// Otherwise, we stop (reply to the user)

const workflow = new StateGraph(StateAnnotation)
  .addNode('agent', callModel)
  .addNode('check_disponibilidad', toolNodeForGraph)
  .addNode('tools', toolNodeForGraph)
  .addEdge('__start__', 'agent')
  .addConditionalEdges('agent', checkToolCall, [
    'tools',
    'check_disponibilidad',
    '__end__',
  ])
  .addEdge('check_disponibilidad', 'agent')
  .addEdge('tools', 'agent')

const checkpointer = new MemorySaver()

export const app = workflow.compile({
  checkpointer,
  interruptBefore: ['tools'],
})
