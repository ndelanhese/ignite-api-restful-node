import fastify from 'fastify'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app.get('/ping', () => {
  return 'pong'
})

app
  .listen({
    port: env.APP_PORT,
  })
  .then(() => {
    console.log(`HTTP Server Running at port ${env.APP_PORT}!`)
  })
