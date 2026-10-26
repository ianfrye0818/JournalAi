import z from 'zod';

export const configSchema = z.object({
  // GENERAL
  NODE_ENV: z.enum(['development', 'production', 'staging']),
  PORT: z.coerce.number(),
  API_URL: z.url(),
  FRONTEND_URL: z.url(),
  SESSION_SECRET: z.string(),

  // DATABASE
  DATABASE_URL: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),

  // EMAIL`
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  FROM_EMAIL: z.email().optional(),

  // REDIS
  REDIS_URL: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
});
export type AppConfig = z.infer<typeof configSchema>;
