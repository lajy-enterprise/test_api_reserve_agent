import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import { app } from '@/graph'
import { HumanMessage } from '@langchain/core/messages'
import { env } from '@/config'
import dataSource from '@/database/database'
import { Products } from '@/database/entity/products.entity'
import { Like } from 'typeorm'

const PORT = env.port || 3000

const serverExpress = express()
serverExpress.use(
  cors({
    exposedHeaders: ['thread_id'],
  }),
)
serverExpress.use(bodyParser.json())

serverExpress.get('/', async (req, res) => {
  const productRepository = dataSource.getRepository(Products)
  const productOne = await productRepository.findOne({
    where: { account: { name: Like('%comayagua%') } },
    relations: ['account', 'brand', 'category', 'subCategory', 'vendor'],
  })
  res.send(productOne)
})

serverExpress.post('/bot', async (req, res) => {
  const { message, threadId, responseUrl } = req.body
  // console.log('/bot', message, threadId)

  // const headers = {
  //   'Content-Type': 'text/event-stream',
  //   Connection: 'keep-alive',
  //   'Cache-Control': 'no-cache',
  // }
  // res.writeHead(200, headers)
  const thread_id = threadId || uuidv4()
  if (!threadId) {
    res.setHeader('thread_id', thread_id)
  }
  const config = {
    configurable: { thread_id },
    streamMode: 'values' as const,
  }
  let returnMessage = ''
  try {
    for await (const event of await app.stream(
      {
        messages: [new HumanMessage(message)],
      },
      config,
    )) {
      const recentMsg = event.messages.at(-1)
      console.dir(recentMsg.content)
      if (recentMsg._getType() === 'ai') {
        // if (recentMsg.tool_calls[0]?.name === 'check_products') {
        //   res.write(JSON.stringify(recentMsg.tool_calls[0].args))
        // }
        // res.write(recentMsg.content)
        console.dir(recentMsg.content)
        returnMessage = recentMsg.content
      }
    }
  } catch (error) {
    console.error('Error in event stream:', error)
    res.write('Error in event stream')
  } finally {
    res.end()
    req.on('close', () => {
      console.log('Connection closed')
    })
    await reponceMessage(responseUrl, returnMessage)
  }
})

serverExpress.listen(PORT, () => {
  console.log(`Events listening at PORT: ${PORT}`)
})

async function reponceMessage(
  responseUrl: string,
  message: string,
): Promise<void> {
  await fetch(`${responseUrl}/reserve/getDisponibility`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
    }),
  })
}
