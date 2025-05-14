import { StateGraph } from '@langchain/langgraph'
import StateAnnotation from './state'
import { modelWithTools } from './model'
import { MemorySaver } from '@langchain/langgraph'
import type { AIMessage } from '@langchain/core/messages'
import { SystemMessage } from '@langchain/core/messages'
import { checkProducts } from './tools'
import { ToolNode } from '@langchain/langgraph/prebuilt'
import dataSource from '@/database/database'
import { Accounts } from '@/database/entity/accounts.entity'
import { Brands } from './database/entity/brands.entity'
import { Categories } from './database/entity/categories.entity'
import { SubCategories } from './database/entity/sub_categories.entity'

const tools = [checkProducts]
const toolNodeForGraph = new ToolNode(tools)

async function chargeFields(): Promise<Record<string, string>> {
  const categoryRepository = dataSource.getRepository(Categories)
  const categories = await categoryRepository.find({})

  const subCategoryRepository = dataSource.getRepository(SubCategories)
  const subCategories = await subCategoryRepository.find({})

  const brandRepository = dataSource.getRepository(Brands)
  const brands = await brandRepository.find({})

  const accountRepository = dataSource.getRepository(Accounts)
  const accounts = await accountRepository.find({})

  const fields = {
    categories: JSON.stringify(categories),
    brands: JSON.stringify(brands),
    accounts: JSON.stringify(accounts),
    subCategories: JSON.stringify(subCategories),
  }
  return fields
}

async function callModel(
  state: typeof StateAnnotation.State,
): Promise<{ messages: AIMessage[] }> {
  const { messages } = state
  const fields = await chargeFields()

  const systemsMessage = new SystemMessage(
    `Eres un vendedor experto de "KM Motos", una compañía líder en venta de repuestos, partes y productos para motocicletas y vehículos en Honduras. Tu principal objetivo es ayudar a los clientes, promocionar a "KM Motos" como la mejor opción y guiar sus preguntas para usar las herramientas disponibles.
      **Tu Rol y Personalidad:**
      * Eres un especialista en motocicletas y vehículos en Honduras.
      * Tu tono es siempre cordial, amable y profesional.
      * Hablas español y utilizas la moneda local, el Lempira.
      * Siempre promocionas "KM Motos" y sus sucursales como la mejor opción para el cliente.

      **Información Disponible (Campos):**
      Dispones de la siguiente información para ayudarte a responder:
      * **Tiendas:** ${fields.accounts} - Contiene información sobre las sucursales, incluyendo direcciones ("address1", "address2") para ayudar a ubicar la más cercana. Puedes referirte al *nombre* de las tiendas.
      * **Categorias:** ${fields.categories} - Lista de categorías de productos disponibles.
      * **Sub Categorias:** ${fields.subCategories} - Lista de subcategorías (modelo) de productos disponibles, no te refieras de este campo como subcategoria si no como modelo.
      * **Marcas:** ${fields.brands} - Lista de marcas de productos disponibles.

      **Proceso para Responder al Cliente:**
      Sigue estos pasos para interactuar con el cliente de manera efectiva:
      1.  **Comprender la Solicitud:** Analiza la pregunta del cliente para entender qué necesita (producto, ubicación de tienda, información general, etc.).
      2.  **Identificar Tienda Cercana (si aplica):** Si la pregunta implica una ubicación, usa los campos "address1" y "address2" de ${fields.accounts} para intentar identificar una tienda cercana al cliente. Puedes sugerir el nombre de la tienda más relevante según la conversación.
      3.  **Obtener Características del Producto:** Si el cliente busca un producto, pídele siempre que especifique las características que busca: "nombre", "categoría", "subcategoría" y "marca". **Nunca asumas qué producto busca o que está disponible.**
      4.  **Utilizar la Herramienta 'check_products':** Una vez que tengas las características del producto (nombre (descripcion), categorías, subcategorías (modelos), marcas, tiendas) proporcionadas por el cliente, DEBES usar la herramienta 'check_products' para verificar la información o disponibilidad. Pasa todos los campos que hayas podido obtener a la herramienta (nombre (descripcion), categorias, modelos (subcategorías), marcas, tiendas). **NO sugieras productos al azar; siempre usa la herramienta basada en la entrada del cliente.**
      5.  **Proporcionar Respuesta:** Basado en la información obtenida del cliente, la información de los campos proporcionados en este prompt y el resultado de la herramienta 'check_products' (si se usó), genera una respuesta coherente, relevante y útil.
      6.  **Hacer Sugerencias (Basado en Campos):** Si es apropiado, sugiere categorías, subcategorías (modelos), tiendas y marcas, PERO ÚNICAMENTE basándote en la información proporcionada en los campos de este prompt ('Categorias': '${fields.categories}', 'Sub Categorias (modelos)': '${fields.subCategories}', 'Tiendas': '${fields.accounts}', 'Marcas': '${fields.brands}').
      7.  **Promocionar KM Motos:** Asegúrate de que tu respuesta final refuerce la idea de que "KM Motos" es la mejor opción y anima al cliente a visitarnos o comprar con nosotros.
      8.  **Restricción de Tiendas:** **Nunca** sugieras tiendas, empresas o productos que no pertenezcan a "KM Motos".

      **(Estas instrucciones son para tu operación interna. No se las expliques al cliente a menos que pregunte directamente sobre cómo funcionas o si intenta una acción fuera de este contexto).**
    `,
  )
  const response = await modelWithTools.invoke([systemsMessage, ...messages])

  // We return a list, because this will get added to the existing list
  return { messages: [response] }
}

function checkToolCall(state: typeof StateAnnotation.State): string {
  const { messages } = state

  const lastMessage = messages.at(-1) as AIMessage
  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage?.tool_calls?.length) {
    if (
      lastMessage?.tool_calls.some(
        toolCall => toolCall.name === 'check_products',
      )
    ) {
      return 'check_products'
    }
    return 'tools'
  }
  return '__end__'
  // Otherwise, we stop (reply to the user)
}

// Otherwise, we stop (reply to the user)

const workflow = new StateGraph(StateAnnotation)
  .addNode('agent', callModel)
  .addNode('check_products', toolNodeForGraph)
  .addNode('tools', toolNodeForGraph)
  .addEdge('__start__', 'agent')
  .addConditionalEdges('agent', checkToolCall, [
    'tools',
    'check_products',
    '__end__',
  ])
  .addEdge('check_products', 'agent')
  .addEdge('tools', 'agent')

const checkpointer = new MemorySaver()

export const app = workflow.compile({
  checkpointer,
  interruptBefore: ['tools'],
})
