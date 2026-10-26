import { Command } from '@nestjs/cqrs';
import { StartInterviewRoundRequest } from './StartInterviewRound.request';
import { StartInterviewRoundResponse } from './StartInterviewRound.response';

export class StartInterviewRoundCommand extends Command<StartInterviewRoundResponse> {
  constructor(
    public readonly userId: string,
    public readonly timezone: string,
    public readonly request: StartInterviewRoundRequest,
  ) {
    super();
  }
}
