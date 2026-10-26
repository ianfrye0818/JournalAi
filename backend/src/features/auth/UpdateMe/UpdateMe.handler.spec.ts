import { validate } from 'class-validator';
import { PrismaService } from '@src/services/prisma.service';
import { makeUser } from '../shared/user.fixture';
import { UpdateMeHandler } from './UpdateMe.handler';
import { UpdateMeCommand } from './UpdateMe.command';
import { UpdateMeRequest } from './UpdateMe.request';
describe('UpdateMe', () => {
  it('updates only the authenticated user and returns no password', async () => {
    const user = makeUser();
    const update = jest.fn().mockResolvedValue({ ...user, dayRolloverHour: 0 });
    const handler = new UpdateMeHandler({
      user: { update },
    } as unknown as PrismaService);
    const result = await handler.execute(
      new UpdateMeCommand(user.id, {
        dayRolloverHour: 0,
        timezone: 'America/New_York',
      }),
    );
    expect(update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: { dayRolloverHour: 0, timezone: 'America/New_York' },
    });
    expect(result).not.toHaveProperty('passwordHash');
  });
  it('rejects invalid hours and timezones', async () => {
    for (const data of [
      { dayRolloverHour: -1 },
      { dayRolloverHour: 24 },
      { dayRolloverHour: 4.5 },
      { timezone: 'nonsense' },
    ]) {
      expect(
        (await validate(Object.assign(new UpdateMeRequest(), data))).length,
      ).toBeGreaterThan(0);
    }
    expect(
      await validate(
        Object.assign(new UpdateMeRequest(), {
          dayRolloverHour: 0,
          timezone: 'America/New_York',
        }),
      ),
    ).toEqual([]);
  });
});
