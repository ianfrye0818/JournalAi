import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { BadGatewayException, Injectable } from '@nestjs/common';
import z from 'zod';
import { formatError } from '../lib/utils';
import { AppLogger } from './applogger.service';
import { ConfigService } from './configService/config.service';

// Schema-invalid output is retried once; transient HTTP failures are retried by the SDK itself.
const MAX_ATTEMPTS = 2;

export type StructuredRequest<T extends z.ZodType> = {
  /** Short name for logs, e.g. `interview`. */
  label: string;
  /** Text blocks let callers mark a stable prefix with `cache_control`. */
  system: string | Anthropic.Beta.BetaTextBlockParam[];
  messages: Anthropic.Beta.BetaMessageParam[];
  schema: T;
  maxTokens?: number;
  effort?: 'low' | 'medium' | 'high';
};

export type StructuredResult<T> = {
  output: T;
  /** The model that actually answered, which differs from the configured one after a fallback. */
  model: string;
};

/** Thrown internally when a response can't be used; the caller retries or gives up with a 502. */
class UnusableResponseError extends Error {
  constructor(
    message: string,
    readonly retryable: boolean,
  ) {
    super(message);
  }
}

/** Server-side Claude client. The API key never leaves the backend. */
@Injectable()
export class AnthropicService {
  private readonly logger = new AppLogger(AnthropicService.name);
  private readonly client: Anthropic;
  private readonly model: string;

  constructor(configService: ConfigService) {
    // Without ANTHROPIC_API_KEY the SDK falls back to its own credential chain (e.g. `ant auth login`).
    this.client = new Anthropic({
      apiKey: configService.has('ANTHROPIC_API_KEY')
        ? configService.get('ANTHROPIC_API_KEY')
        : undefined,
    });
    this.model = configService.get('ANTHROPIC_MODEL');
  }

  /**
   * Asks Claude for JSON matching `schema` (via structured outputs) and validates it with Zod, which
   * also enforces constraints JSON Schema can't express to the API (lengths, array sizes).
   * Throws `BadGatewayException` when the API fails or the output is still unusable after a retry.
   */
  async generateStructured<T extends z.ZodType>(
    request: StructuredRequest<T>,
  ): Promise<z.infer<T>> {
    return (await this.generateStructuredWithModel(request)).output;
  }

  /** Like `generateStructured`, but also reports which model wrote the output. */
  async generateStructuredWithModel<T extends z.ZodType>(
    request: StructuredRequest<T>,
  ): Promise<StructuredResult<z.infer<T>>> {
    for (let attempt = 1; ; attempt++) {
      try {
        return await this.attempt(request);
      } catch (error) {
        if (error instanceof Anthropic.APIError) {
          this.logger.error(
            `[${request.label}] Anthropic API error ${error.status ?? 'connection'}: ${error.message}`,
          );
          throw new BadGatewayException('The AI service is unavailable');
        }
        if (!(error instanceof UnusableResponseError)) throw error;

        this.logger.warn(
          `[${request.label}] unusable response (attempt ${attempt}/${MAX_ATTEMPTS}): ${error.message}`,
        );
        if (!error.retryable || attempt >= MAX_ATTEMPTS) {
          throw new BadGatewayException('The AI returned an unusable response');
        }
      }
    }
  }

  private async attempt<T extends z.ZodType>({
    label,
    system,
    messages,
    schema,
    maxTokens = 16_000,
    effort = 'medium',
  }: StructuredRequest<T>): Promise<StructuredResult<z.infer<T>>> {
    const response = await this.client.beta.messages.create({
      model: this.model,
      max_tokens: maxTokens,
      system,
      messages,
      output_config: { effort, format: betaZodOutputFormat(schema) },
      // On a policy decline, let the API re-run the request on its default fallback model.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
    });
    this.logUsage(label, response);

    if (response.stop_reason === 'refusal') {
      throw new UnusableResponseError(
        `refused (${response.stop_details?.category ?? 'no category'})`,
        false,
      );
    }
    if (response.stop_reason === 'max_tokens') {
      throw new UnusableResponseError('hit max_tokens', true);
    }

    const text = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');

    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch (error) {
      throw new UnusableResponseError(
        `invalid JSON: ${formatError(error)}`,
        true,
      );
    }
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      throw new UnusableResponseError(
        `schema mismatch: ${z.prettifyError(parsed.error)}`,
        true,
      );
    }
    return { output: parsed.data, model: response.model };
  }

  private logUsage(label: string, response: Anthropic.Beta.BetaMessage) {
    const { usage } = response;
    this.logger.log(
      `[${label}] ${response.model} stop=${response.stop_reason} ` +
        `in=${usage.input_tokens} out=${usage.output_tokens} ` +
        `cacheRead=${usage.cache_read_input_tokens ?? 0} cacheWrite=${usage.cache_creation_input_tokens ?? 0}`,
    );
  }
}
