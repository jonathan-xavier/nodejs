import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import crypto, { randomUUID } from 'crypto'

const TABLE = 'transactions'
export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex(TABLE).select('*')
    return {
      transactions,
    }
  })

  app.get('/:id', async (request) => {
    const getTransactionParamSchema = z.object({
      id: z.uuid(),
    })

    const { id } = getTransactionParamSchema.parse(request.params)
    const transaction = await knex(TABLE).where('id', id).first()
    return {
      transaction,
    }
  })

  app.get('/summary', async () => {
    const summary = await knex(TABLE).sum('amount', { as: 'amount' }).first()
    return { summary }
  })

  app.post('/', async (request, response) => {
    const createTransactionsBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionsBodySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId
    if (!sessionId) {
      sessionId = randomUUID()
      response.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex(TABLE).insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return response.status(201).send()
  })
}
