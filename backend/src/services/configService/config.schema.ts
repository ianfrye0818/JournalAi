import z from 'zod';

export const configSchema = z.object({
  // GENERAL
  NODE_ENV: z.enum(['development', 'production', 'staging']),
  PORT: z.coerce.number(),
  API_URL: z.url(),
  FRONTEND_URL: z.url().optional(),

  // DATABASE
  DATABASE_URL: z.string(),

  // EMAIL
  RESEND_API_KEY: z.string().min(1).optional(),
  FROM_EMAIL: z.email().optional(),

  // REDIS
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_PASSWORD: z.string().optional(),

  // AI
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default('claude-sonnet-5-5'),
});
export type AppConfig = z.infer<typeof configSchema>;
