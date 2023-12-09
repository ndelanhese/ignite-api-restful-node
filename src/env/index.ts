import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.string(),
  DATABASE_MIGRATIONS_DIRECTORY: z.string().default('./db/migrations'),
  APP_PORT: z
    .string()
    .default('3333')
    .transform((port) => Number(port)),
  NODE_ENV: z
    .enum(['production', 'development', 'staging', 'test'])
    .default('production'),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables!', _env.error.format())

  throw new Error('Invalid environment variables!')
}

export const env = _env.data
