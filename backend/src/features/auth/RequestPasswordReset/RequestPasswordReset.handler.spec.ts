import { EmailService } from '@src/services/email.service';
import { PrismaService } from '@src/services/prisma.service';
import { RedisService } from '@src/services/redis.service';
import { hashResetCode } from '../shared/password-reset';
import { RequestPasswordResetCommand } from './RequestPasswordReset.command';
import { RequestPasswordResetHandler } from './RequestPasswordReset.handler';

describe('RequestPasswordReset', () => {
  const findUnique = jest.fn();
  const set = jest.fn();
  const sendEmail = jest.fn();
  const handler = new RequestPasswordResetHandler(
    { user: { findUnique } } as unknown as PrismaService,
    { getClient: () => ({ set }) } as unknown as RedisService,
    { sendEmail } as unknown as EmailService,
  );
  const request = (email = ' Me@Example.com ') =>
    handler.execute(new RequestPasswordResetCommand({ email }));

  beforeEach(() => {
    jest.resetAllMocks();
    findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'me@example.com',
      isActive: true,
    });
    set.mockResolvedValue('OK');
    sendEmail.mockResolvedValue(undefined);
  });

  it('stores only a hash of the code and emails the code itself', async () => {
    await request();
    expect(findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { email: 'me@example.com' } }),
    );
    const { text } = (sendEmail.mock.calls as [{ text: string }][])[0][0];
    const code = /(\d{6})/.exec(text)![1];
    expect(set).toHaveBeenCalledWith(
      'auth:reset:user-1',
      hashResetCode(code),
      'EX',
      900,
    );
    expect(set).not.toHaveBeenCalledWith(
      expect.anything(),
      code,
      expect.anything(),
      expect.anything(),
    );
  });

  it('does nothing visible for unknown or inactive accounts', async () => {
    findUnique.mockResolvedValueOnce(null);
    await expect(request()).resolves.toBeUndefined();
    findUnique.mockResolvedValueOnce({
      id: 'u',
      email: 'x@y.z',
      isActive: false,
    });
    await expect(request()).resolves.toBeUndefined();
    expect(set).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('sends at most one code a minute', async () => {
    set.mockResolvedValueOnce(null); // cooldown key already present
    await request();
    expect(set).toHaveBeenCalledTimes(1);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('still succeeds when the email provider fails', async () => {
    sendEmail.mockRejectedValue(new Error('Resend down'));
    await expect(request()).resolves.toBeUndefined();
  });
});
