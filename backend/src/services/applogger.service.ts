import {
  ConsoleLogger,
  ConsoleLoggerOptions,
  Injectable,
  Optional,
  Scope,
} from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends ConsoleLogger {
  constructor(
    @Optional() context: string = AppLogger.name,
    @Optional() options?: Partial<ConsoleLoggerOptions>,
  ) {
    super(context, { timestamp: true, ...options });
  }
}
