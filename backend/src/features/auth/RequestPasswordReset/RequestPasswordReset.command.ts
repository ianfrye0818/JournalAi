import { Command } from '@nestjs/cqrs';
import { RequestPasswordResetRequest } from './RequestPasswordReset.request';

export class RequestPasswordResetCommand extends Command<void> {
  constructor(public readonly request: RequestPasswordResetRequest) {
    super();
  }
}
