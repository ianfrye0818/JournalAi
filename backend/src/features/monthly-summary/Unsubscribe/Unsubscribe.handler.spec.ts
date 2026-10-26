import { PrismaService } from '@src/services/prisma.service';
import { UnsubscribeCommand } from './Unsubscribe.command';
import { UnsubscribeHandler } from './Unsubscribe.handler';
describe('Unsubscribe', () => {
  const findUnique = jest.fn();
  const update = jest.fn();
  const handler = new UnsubscribeHandler({
    monthlySummary: { findUnique },
    user: { update },
  } as unknown as PrismaService);
  beforeEach(() => jest.resetAllMocks());
  it('turns off the recap for the owner of the emailed recap', async () => {
    findUnique.mockResolvedValue({ userId: 'user-1' });
    await handler.execute(new UnsubscribeCommand('recap-1'));
    expect(update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { monthlyRecap: false },
    });
  });
  it('ignores unknown ids', async () => {
    findUnique.mockResolvedValue(null);
    await handler.execute(new UnsubscribeCommand('missing'));
    expect(update).not.toHaveBeenCalled();
  });
});
