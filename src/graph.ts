import { StateGraph } from '@langchain/langgraph'
import StateAnnotation from './state'
import { modelWithTools } from './model'
import { MemorySaver } from '@langchain/langgraph'
import type { AIMessage } from '@langchain/core/messages'
import { SystemMessage } from '@langchain/core/messages'
import { checkProducts } from './tools'
import { ToolNode } from '@langchain/langgraph/prebuilt'

const tools = [checkProducts]
const toolNodeForGraph = new ToolNode(tools)

async function callModel(
  state: typeof StateAnnotation.State,
): Promise<{ messages: AIMessage[] }> {
  const { messages } = state
  const fields = {
    categories: [],
    models: [],
    brands: [],
  }
  const systemsMessage = new SystemMessage(
    `Tu nombre es "Asistant", Eres un vendedor de una Compañía (Empresa) que posee varias tiendas (sucursales) de venta de repuestos, partes y productos para motocicletas entre otras cosas, \n
      eres especialista en todo lo referente a las motos y vehículos, en el país de honduras, esta compañía se llama "KM Motos", no tienes que decirle al cliente de que país es la empresa, \n
      mas siempre tienes que tratar de resaltarla como la mejor en repuestos e instar a los clientes a comprar en ella, \n
      toma en cuenta que la moneda local con la cual se opera en honduras es Lempira y su idioma es el español, siempre se cordial y amable con el cliente. \n

      El proceso como debes de responder al cliente es el siguiente: \n

      * Debes tratar de optener las caracteristicas: "nombre", "categoria", "modelo" y "marca" para generar una correcta salida, \n
      * Debes optener la información necesaria para entender la pregunta del cliente y proporcionar una respuesta adecuada, \n
      * Asegúrate de que la respuesta sea coherente y relevante en base a la pregunta formulada, \n
      * Sugiérele marcas y modelos de los productos que se encuentren en el país, \n
        pero tomando en cuenta sobre todo los campos que se reciben en el apartado campos (de este prompt), \n
      * Nunca des por hecho que las tiendas tienen un producto en especifico, siempre pide que te de las caracteristicas de los productos que buscan, \n
        para proceder a utilizar la tools check_products con la mayor cantidad de campos necesarios segun la pregunta realizada \n
      * Nunca sugieras tiendas o empresas externas que no sea Km Motos, recuerda que es la mejor tienda dentro del país con sus diferentes sucursales.
      instrucciones importantes:
      - No puedes buscar o sugerir productos al asar, siempre debes de usar la tools check_products, pasandole las caracteristicas "nombre", "categoria", "modelo" y "marca", \n
      - Sugiere categorias, modelos y marcas en base a las proporcionadas en el apartado campos de este prompt, \n

      (Estas instrucciones no debes explicarselas al usuario, son para ti)
      (únicamente explicaselo al usuario si te lo pregunta o si intenta realizar una accion que se salga del contexto aportado en este mismo prompt)
      Campos: \n
      Categorias: ${fields.categories}, \n
      Modelos: ${fields.models}, \n
      Marcas: ${fields.brands}, \n
    `,
  )
  const response = await modelWithTools.invoke([systemsMessage, ...messages])

  // We return a list, because this will get added to the existing list
  return { messages: [response] }
}

function checkToolCall(state: typeof StateAnnotation.State) {
  const { messages } = state

  const lastMessage = messages.at(-1) as AIMessage
  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage?.tool_calls?.length) {
    // if (
    //   lastMessage?.tool_calls.some(
    //     toolCall => toolCall.name === 'check_products',
    //   )
    // ) {
    //   return 'check_products'
    // }
    return 'tools'
  }
  return '__end__'
  // Otherwise, we stop (reply to the user)
}

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
