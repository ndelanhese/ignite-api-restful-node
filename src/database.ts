import 'dotenv/config'
import { knex as setupKnex, Knex } from 'knex'

const { DATABASE_URL, DATABASE_CLIENT } = process.env

if (!DATABASE_URL || !DATABASE_CLIENT) {
  throw new Error('Internal server error, database env not found')
}

export const config: Knex.Config = {
  client: DATABASE_CLIENT,
  connection: { filename: DATABASE_URL },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    extension: 'ts',
    directory: './db/migrations',
  },
  useNullAsDefault: true,
}

export const knex = setupKnex(config)
