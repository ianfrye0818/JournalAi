import {
  ConsoleLogger,
  ConsoleLoggerOptions,
  Injectable,
  Scope,
} from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends ConsoleLogger {
  constructor(context: string, options?: Partial<ConsoleLoggerOptions>) {
    super(context, { timestamp: true, ...options });
  }
}
