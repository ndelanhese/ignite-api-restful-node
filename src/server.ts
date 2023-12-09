import 'dotenv/config'
import fastify from 'fastify'
import { knex } from './database'

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
    port: process?.env?.APP_PORT ? Number(process.env.APP_PORT) : 3333,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
