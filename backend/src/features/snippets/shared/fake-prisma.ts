import { randomUUID } from 'node:crypto';
import { Prisma, type DailySession, type Snippet } from '@prisma/generated';

/**
 * In-memory stand-in for the slice of PrismaService the snippet handlers use. It enforces the
 * real unique keys, so specs can assert on stored state instead of call shapes.
 */
export class FakeSnippetPrisma {
  sessions: DailySession[] = [];
  snippets: Snippet[] = [];
  /** Returns a server timestamp for each write, so tests can control the clock. */
  now = () => new Date();

  dailySession = {
    upsert: jest.fn(
      ({
        where: { userId_date },
      }: {
        where: { userId_date: { userId: string; date: Date } };
      }) => {
        const { userId, date } = userId_date;
        let session = this.sessions.find(
          (s) => s.userId === userId && s.date.getTime() === date.getTime(),
        );
        if (!session) {
          const now = this.now();
          session = {
            id: randomUUID(),
            userId,
            date,
            status: 'open',
            interviewRound: 0,
            createdAt: now,
            updatedAt: now,
            finalizedAt: null,
          };
          this.sessions.push(session);
        }
        return Promise.resolve({ id: session.id });
      },
    ),
  };

  snippet = {
    findMany: jest.fn(
      ({ where }: { where: { userId: string; clientId?: { in: string[] } } }) =>
        Promise.resolve(
          this.snippets.filter(
            (s) =>
              s.userId === where.userId &&
              (!where.clientId || where.clientId.in.includes(s.clientId)),
          ),
        ),
    ),
    findUniqueOrThrow: jest.fn(
      ({
        where: { userId_clientId },
      }: {
        where: { userId_clientId: { userId: string; clientId: string } };
      }) => {
        const row = this.find(userId_clientId.userId, userId_clientId.clientId);
        return row
          ? Promise.resolve(row)
          : Promise.reject(new Error('Not found'));
      },
    ),
    create: jest.fn(({ data }: { data: Omit<Snippet, 'id' | 'updatedAt'> }) => {
      if (this.find(data.userId, data.clientId)) {
        return Promise.reject(
          new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
            code: 'P2002',
            clientVersion: 'test',
          }),
        );
      }
      const row: Snippet = { ...data, id: randomUUID(), updatedAt: this.now() };
      this.snippets.push(row);
      return Promise.resolve(row);
    }),
    updateMany: jest.fn(
      ({
        where,
        data,
      }: {
        where: { id: string; userId: string; clientUpdatedAt: { lt: Date } };
        data: Partial<Snippet>;
      }) => {
        const rows = this.snippets.filter(
          (s) =>
            s.id === where.id &&
            s.userId === where.userId &&
            s.clientUpdatedAt < where.clientUpdatedAt.lt,
        );
        for (const row of rows)
          Object.assign(row, data, { updatedAt: this.now() });
        return Promise.resolve({ count: rows.length });
      },
    ),
  };

  find(userId: string, clientId: string) {
    return this.snippets.find(
      (s) => s.userId === userId && s.clientId === clientId,
    );
  }
}
