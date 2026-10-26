import { Command } from '@nestjs/cqrs';
export class DeleteAccountCommand extends Command<void> {
  constructor(public readonly userId: string) {
    super();
  }
}
