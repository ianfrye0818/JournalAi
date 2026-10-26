import { EmailService } from './email.service';

describe('Resend email', () => {
  afterEach(() => jest.restoreAllMocks());
  const config = {
    get: (key: string) =>
      ({ RESEND_API_KEY: 'test-key', FROM_EMAIL: 'sender@example.com' })[key],
  };
  it('sends through Resend with authentication and idempotency', async () => {
    const request = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({ ok: true } as Response);
    await new EmailService(config as never).sendEmail({
      to: 'me@example.com',
      subject: 'Recap',
      html: '<p>Hello</p>',
      idempotencyKey: 'month/1',
    });
    expect(request).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-key',
          'Idempotency-Key': 'month/1',
        }) as unknown,
      }),
    );
  });
  it('propagates provider failures so the scheduler can retry', async () => {
    jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({ ok: false, status: 403 } as Response);
    await expect(
      new EmailService(config as never).sendEmail({
        to: 'me@example.com',
        subject: 'Recap',
        html: 'Hello',
      }),
    ).rejects.toThrow('HTTP 403');
  });
});
