import { knex as setupKnex, Knex } from 'knex'
import { env } from './env'

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: { filename: env.DATABASE_URL },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    extension: 'ts',
    directory: env.DATABASE_MIGRATIONS_DIRECTORY,
  },
  useNullAsDefault: true,
}

export const knex = setupKnex(config)
