import {
  escapeHtml,
  longestStreak,
  MonthlySummaryService,
  previousMonth,
} from './monthly-summary.service';

describe('monthly recap', () => {
  it('uses the account timezone, handles January and leap years, and waits until 9am', () => {
    const period = previousMonth(
      new Date('2024-03-01T13:00:00Z'),
      'America/New_York',
    );
    expect(period.month).toBe('2024-02');
    expect(period.daysInMonth).toBe(29);
    expect(period.due).toBe(false);
    expect(
      previousMonth(new Date('2024-03-01T14:00:00Z'), 'America/New_York').due,
    ).toBe(true);
    expect(previousMonth(new Date('2025-01-02T00:00:00Z'), 'UTC').month).toBe(
      '2024-12',
    );
  });

  it('calculates streaks with gaps and duplicates and escapes generated HTML', () => {
    expect(
      longestStreak(
        ['01', '02', '02', '04'].map((day) => new Date(`2024-02-${day}`)),
      ),
    ).toBe(2);
    expect(escapeHtml('<script>"&')).toBe('&lt;script&gt;&quot;&amp;');
  });

  function setup() {
    const prisma = {
      user: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'u',
            email: 'me@example.com',
            timezone: 'UTC',
          },
        ]),
      },
      monthlySummary: {
        upsert: jest.fn().mockResolvedValue({ id: 'recap', sentAt: null }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        update: jest.fn().mockResolvedValue({}),
      },
      dailySession: {
        findMany: jest.fn().mockResolvedValue([
          {
            date: new Date('2024-02-01'),
            status: 'finalized',
            Snippets: [{ text: 'A good walk' }],
            Entry: { body: 'A good day.' },
          },
          {
            date: new Date('2024-02-02'),
            status: 'open',
            Snippets: [],
            Entry: null,
          },
        ]),
      },
    };
    const ai = {
      generateStructured: jest.fn().mockResolvedValue({
        summary: 'Good month',
        mood: 'Seems positive',
        themes: ['Nature'],
        highlights: ['Walking'],
        reflection: 'What felt restorative?',
      }),
    };
    const email = { sendEmail: jest.fn().mockResolvedValue(undefined) };
    const service = new MonthlySummaryService(
      prisma as never,
      ai as never,
      email as never,
    );
    return { service, prisma, ai, email };
  }

  it('scopes journal content, excludes deleted snippets, calculates exact stats, and persists before sending', async () => {
    const { service, prisma, email } = setup();
    await service.run(new Date('2024-03-01T10:00:00Z'));
    const query = (
      prisma.dailySession.findMany.mock.calls as unknown[][]
    )[0][0] as {
      where: { userId: string };
      select: { Snippets: { where: { deletedAt: null } } };
    };
    expect(query.where.userId).toBe('u');
    expect(query.select.Snippets.where).toEqual({ deletedAt: null });
    expect(email.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'me@example.com',
        text: expect.stringContaining('1 of 29 days logged') as unknown,
        idempotencyKey: 'monthly-summary/recap',
      }),
    );
    expect(
      prisma.monthlySummary.update.mock.invocationCallOrder[0],
    ).toBeLessThan(email.sendEmail.mock.invocationCallOrder[0]);
    expect(prisma.monthlySummary.update).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: { sentAt: expect.any(Date) as unknown },
      }),
    );
  });

  it('loads active users and sends separate recaps, continuing after a failure', async () => {
    const { service, prisma, email } = setup();
    prisma.user.findMany.mockResolvedValueOnce([
      { id: 'u', email: 'first@example.com', timezone: 'UTC' },
      { id: 'v', email: 'second@example.com', timezone: 'UTC' },
    ]);
    email.sendEmail.mockRejectedValueOnce(new Error('Unavailable'));
    await service.run(new Date('2024-03-02'));
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      select: { id: true, email: true, timezone: true },
    });
    const queries = prisma.dailySession.findMany.mock.calls as unknown as [
      { where: { userId: string } },
    ][];
    expect(queries.map(([query]) => query.where.userId)).toEqual(['u', 'v']);
    expect(email.sendEmail).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ to: 'first@example.com' }),
    );
    expect(email.sendEmail).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ to: 'second@example.com' }),
    );
  });

  it('skips delivered months and unavailable leases', async () => {
    const { service, prisma, ai } = setup();
    prisma.monthlySummary.upsert.mockResolvedValueOnce({
      id: 'recap',
      sentAt: new Date(),
    });
    await service.run(new Date('2024-03-02'));
    prisma.monthlySummary.updateMany.mockResolvedValueOnce({ count: 0 });
    await service.run(new Date('2024-03-02'));
    expect(ai.generateStructured).not.toHaveBeenCalled();
  });

  it('reuses cached content on retry and leaves failures unsent', async () => {
    const { service, prisma, ai, email } = setup();
    prisma.monthlySummary.upsert.mockResolvedValueOnce({
      id: 'recap',
      sentAt: null,
      subject: 'Cached',
      text: 'Text',
      html: '<p>Text</p>',
    });
    email.sendEmail.mockRejectedValueOnce(new Error('Unavailable'));
    await service.run(new Date('2024-03-02'));
    expect(ai.generateStructured).not.toHaveBeenCalled();
    expect(prisma.monthlySummary.update).not.toHaveBeenCalled();
    expect(prisma.monthlySummary.updateMany).toHaveBeenLastCalledWith(
      expect.objectContaining({ data: { lockedUntil: null } }),
    );
  });
});
