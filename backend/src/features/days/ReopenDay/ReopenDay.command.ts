import { Command } from '@nestjs/cqrs';
import { ReopenDayRequest } from './ReopenDay.request';
import { ReopenDayResponse } from './ReopenDay.response';

export class ReopenDayCommand extends Command<ReopenDayResponse> {
  constructor(
    public readonly userId: string,
    public readonly request: ReopenDayRequest,
  ) {
    super();
  }
}
