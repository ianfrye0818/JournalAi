import { PrismaService } from '@src/services/prisma.service';
import { TokenService } from '@src/services/token.service';
import { DeleteAccountHandler } from './DeleteAccount.handler';
import { DeleteAccountCommand } from './DeleteAccount.command';
describe('DeleteAccount', () => {
  const revokeAll = jest.fn();
  const deleteUser = jest.fn();
  const handler = new DeleteAccountHandler(
    { user: { delete: deleteUser } } as unknown as PrismaService,
    { revokeAll } as unknown as TokenService,
  );
  beforeEach(() => jest.resetAllMocks());
  it('revokes every session and deletes the authenticated user (relations cascade)', async () => {
    await handler.execute(new DeleteAccountCommand('user-1'));
    expect(revokeAll).toHaveBeenCalledWith('user-1');
    expect(deleteUser).toHaveBeenCalledWith({ where: { id: 'user-1' } });
  });
  it('keeps data when token revocation fails', async () => {
    revokeAll.mockRejectedValue(new Error('Redis down'));
    await expect(
      handler.execute(new DeleteAccountCommand('user-1')),
    ).rejects.toThrow('Redis down');
    expect(deleteUser).not.toHaveBeenCalled();
  });
});
