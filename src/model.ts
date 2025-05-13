import { checkProducts } from './tools'
import { ChatOpenAI } from '@langchain/openai'
import { env } from '@/config'

const tools = [checkProducts]

export const modelWithTools = new ChatOpenAI({
  model: 'gpt-4o',
  openAIApiKey: env.openai_api_key,
  temperature: 0.5,
}).bindTools(tools)
