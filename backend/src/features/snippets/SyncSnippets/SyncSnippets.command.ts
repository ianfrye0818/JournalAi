import { Command } from '@nestjs/cqrs';
import { SyncSnippetsRequest } from './SyncSnippets.request';
import { SyncSnippetsResponse } from './SyncSnippets.response';

export class SyncSnippetsCommand extends Command<SyncSnippetsResponse> {
  constructor(
    public readonly userId: string,
    public readonly request: SyncSnippetsRequest,
  ) {
    super();
  }
}
