import { Inject, Injectable } from '@nestjs/common';
import dotenv from 'dotenv';
import { AppConfig, configSchema } from './config.schema';

export const CONFIG_TOKEN = 'CONFIG_TOKEN';

dotenv.config({ quiet: true });

@Injectable()
export class ConfigService {
  private validatedEnv: AppConfig;
  private schema: typeof configSchema;

  constructor(
    @Inject(CONFIG_TOKEN) schema: typeof configSchema,
    envFile?: string,
  ) {
    this.schema = schema;
    const env = envFile
      ? dotenv.config({ path: envFile, quiet: true }).parsed
      : process.env;
    this.validatedEnv = this.schema.parse(env);
  }

  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    const value = this.validatedEnv[key];
    if (value === undefined) {
      throw new Error(
        `Environment variable '${String(key)}' not found or failed validation`,
      );
    }
    return value;
  }

  getAll(): AppConfig {
    return this.validatedEnv;
  }

  has<K extends keyof AppConfig>(key: K): boolean {
    return this.validatedEnv[key] !== undefined;
  }
}
