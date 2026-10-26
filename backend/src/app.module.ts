import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { DaysModule } from './features/days/days.module';
import { EntriesModule } from './features/entries/entries.module';
import { HealthModule } from './features/health/health.module';
import { QuestionsModule } from './features/questions/questions.module';
import { SnippetsModule } from './features/snippets/snippets.module';
import { TranscribeModule } from './features/transcribe/transcribe.module';
import { CustomConfigModule } from './services/configService/config.module';
import { configSchema } from './services/configService/config.schema';
import { GlobalServicesModule } from './services/globalservices.module';

@Module({
  imports: [
    CustomConfigModule.forRoot({
      schema: configSchema,
    }),
    ScheduleModule.forRoot(),
    CqrsModule.forRoot(),
    GlobalServicesModule,
    HealthModule,
    SnippetsModule,
    DaysModule,
    EntriesModule,
    QuestionsModule,
    TranscribeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
