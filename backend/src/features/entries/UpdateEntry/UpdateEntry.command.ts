import { Command } from '@nestjs/cqrs';
import { UpdateEntryRequest } from './UpdateEntry.request';
import { UpdateEntryResponse } from './UpdateEntry.response';

export class UpdateEntryCommand extends Command<UpdateEntryResponse> {
  constructor(
    public readonly userId: string,
    public readonly entryId: string,
    public readonly request: UpdateEntryRequest,
  ) {
    super();
  }
}
