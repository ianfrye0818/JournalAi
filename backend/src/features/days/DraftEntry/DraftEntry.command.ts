import { Command } from '@nestjs/cqrs';
import { DraftEntryRequest } from './DraftEntry.request';
import { DraftEntryResponse } from './DraftEntry.response';

export class DraftEntryCommand extends Command<DraftEntryResponse> {
  constructor(
    public readonly userId: string,
    public readonly timezone: string,
    public readonly date: string,
    public readonly request: DraftEntryRequest,
  ) {
    super();
  }
}
