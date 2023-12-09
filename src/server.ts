import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'

const app = fastify()

app.get('/hello', async () => {
  const tables = await knex('sqlite_schema').select('*')

  return tables
})

app.get('/ping', () => {
  return 'pong'
})

app
  .listen({
    port: env.APP_PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
