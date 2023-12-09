import fastify from 'fastify'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'
import fastifyCookie from '@fastify/cookie'

const app = fastify()

app.register(fastifyCookie)
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
