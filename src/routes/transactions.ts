import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/checkSessionIdExists'

export const transactionsRoutes = async (app: FastifyInstance) => {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const sessionId = request?.cookies?.session_id

      const transactions = await knex('transactions')
        .select()
        .where('session_id', sessionId)

      return {
        data: transactions,
      }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const sessionId = request?.cookies?.session_id

      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionParamsSchema.parse(request.params)

      const [transaction] = await knex('transactions').select().where({
        id,
        session_id: sessionId,
      })

      return transaction
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const sessionId = request?.cookies?.session_id
      const [summary] = await knex('transactions')
        .sum('amount', {
          as: 'amount',
        })
        .where('session_id', sessionId)
      return summary
    },
  )

  app.post('/', async (request, response) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { amount, title, type } = createTransactionBodySchema.parse(
      request.body,
    )

    const sessionId = request?.cookies?.session_id ?? randomUUID()

    const SEVEN_DAYS_IN_SECONDS = 1000 * 60 * 60 * 24 * 7

    if (!request?.cookies?.session_id) {
      response.cookie('session_id', sessionId, {
        path: '/',
        maxAge: SEVEN_DAYS_IN_SECONDS,
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return response.status(201).send()
  })
}
