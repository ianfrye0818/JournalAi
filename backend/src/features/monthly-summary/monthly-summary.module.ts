import { Module } from '@nestjs/common';
import { MonthlySummaryController } from './monthly-summary.controller';
import { MonthlySummaryService } from './monthly-summary.service';
import { UnsubscribeHandler } from './Unsubscribe/Unsubscribe.handler';

@Module({
  controllers: [MonthlySummaryController],
  // The recap is a scheduled job rather than a request, so it stays a @Cron service.
  providers: [MonthlySummaryService, UnsubscribeHandler],
})
export class MonthlySummaryModule {}
