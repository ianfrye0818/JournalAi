import { Command } from '@nestjs/cqrs';
export class UnsubscribeCommand extends Command<void> {
  constructor(public readonly recapId: string) {
    super();
  }
}
