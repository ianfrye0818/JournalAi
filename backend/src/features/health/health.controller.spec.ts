import { DayStatus, SnippetSource } from '@prisma/generated';
import { HealthController } from '@src/features/health/health.controller';

describe('HealthController', () => {
  it('returns OK', () => {
    expect(new HealthController().getHealth()).toBe('OK');
  });

  it('resolves the @prisma/generated alias', () => {
    expect(DayStatus.open).toBe('open');
    expect(SnippetSource.voice).toBe('voice');
  });
});
