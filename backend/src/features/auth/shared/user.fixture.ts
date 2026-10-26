import type { User } from '@prisma/generated';

export const makeUser = (overrides: Partial<User> = {}): User => ({
  id: '7b0c3c1e-4c55-4a3e-9d0e-2f2a7f1f6a01',
  email: 'me@example.com',
  passwordHash: 'not-a-real-hash',
  timezone: 'UTC',
  dayRolloverHour: 4,
  isActive: true,
  createdAt: new Date('2026-10-01T00:00:00Z'),
  updatedAt: new Date('2026-10-01T00:00:00Z'),
  ...overrides,
});
