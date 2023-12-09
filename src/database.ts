import { knex as setupKnex, Knex } from 'knex'
import { env } from './env'

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: { filename: env.DATABASE_CLIENT },
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
