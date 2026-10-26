import Anthropic from '@anthropic-ai/sdk';
import { BadGatewayException } from '@nestjs/common';
import z from 'zod';
import { AnthropicService } from './anthropic.service';
import { ConfigService } from './configService/config.service';

const schema = z.object({ items: z.array(z.string()).max(2) });

const message = (
  text: string,
  stopReason: Anthropic.Beta.BetaStopReason = 'end_turn',
) => ({
  model: 'claude-sonnet-5-5',
  stop_reason: stopReason,
  stop_details: null,
  content: [{ type: 'text', text }],
  usage: { input_tokens: 10, output_tokens: 5 },
});

describe(AnthropicService, () => {
  let service: AnthropicService;
  const create = jest.fn();

  const request = {
    label: 'test',
    system: 'system prompt',
    messages: [{ role: 'user' as const, content: 'hi' }],
    schema,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    const config = {
      has: () => true,
      get: (key: string) =>
        key === 'ANTHROPIC_MODEL' ? 'claude-sonnet-5-5' : 'sk-ant-test',
    } as unknown as ConfigService;
    service = new AnthropicService(config);
    // Swap the real SDK call for a mock; nothing here should reach the network.
    (service as unknown as { client: Anthropic }).client.beta.messages.create =
      create;
  });

  it('returns validated output and sends the configured model with structured output', async () => {
    create.mockResolvedValue(message('{"items":["a"]}'));

    await expect(service.generateStructured(request)).resolves.toEqual({
      items: ['a'],
    });
    expect(create).toHaveBeenCalledTimes(1);
    const [params] = create.mock.calls[0] as [
      Anthropic.Beta.MessageCreateParamsNonStreaming,
    ];
    expect(params).toMatchObject({
      model: 'claude-sonnet-5-5',
      system: 'system prompt',
      messages: request.messages,
      fallbacks: 'default',
      output_config: { format: { type: 'json_schema' } },
    });
  });

  it('retries once after schema-invalid output', async () => {
    create
      .mockResolvedValueOnce(message('{"items":["a","b","c"]}'))
      .mockResolvedValueOnce(message('{"items":["a"]}'));

    await expect(service.generateStructured(request)).resolves.toEqual({
      items: ['a'],
    });
    expect(create).toHaveBeenCalledTimes(2);
  });

  it('gives up with 502 when the retry is also invalid', async () => {
    create
      .mockResolvedValueOnce(message('not json'))
      .mockResolvedValueOnce(message('{"items":"nope"}'));

    await expect(service.generateStructured(request)).rejects.toThrow(
      BadGatewayException,
    );
    expect(create).toHaveBeenCalledTimes(2);
  });

  it('retries a response cut off at max_tokens', async () => {
    create
      .mockResolvedValueOnce(message('{"items":["a"', 'max_tokens'))
      .mockResolvedValueOnce(message('{"items":[]}'));

    await expect(service.generateStructured(request)).resolves.toEqual({
      items: [],
    });
  });

  it('does not retry a refusal', async () => {
    create.mockResolvedValue(message('', 'refusal'));

    await expect(service.generateStructured(request)).rejects.toThrow(
      BadGatewayException,
    );
    expect(create).toHaveBeenCalledTimes(1);
  });

  it('maps an API error (after the SDK retries) to 502', async () => {
    create.mockRejectedValue(
      new Anthropic.APIError(529, undefined, 'Overloaded', undefined),
    );

    await expect(service.generateStructured(request)).rejects.toThrow(
      BadGatewayException,
    );
    expect(create).toHaveBeenCalledTimes(1);
  });
});
