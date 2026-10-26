import { Command } from '@nestjs/cqrs';
import { UpdateMeRequest } from './UpdateMe.request';
import { UpdateMeResponse } from './UpdateMe.response';
export class UpdateMeCommand extends Command<UpdateMeResponse> {
  constructor(
    public readonly userId: string,
    public readonly request: UpdateMeRequest,
  ) {
    super();
  }
}
