import { Command } from '@nestjs/cqrs';
import { FinalizeDayRequest } from './FinalizeDay.request';
import { FinalizeDayResponse } from './FinalizeDay.response';

export class FinalizeDayCommand extends Command<FinalizeDayResponse> {
  constructor(
    public readonly userId: string,
    public readonly request: FinalizeDayRequest,
  ) {
    super();
  }
}
