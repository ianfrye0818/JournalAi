import { Command } from '@nestjs/cqrs';
import { UpsertStyleProfileRequest } from './UpsertStyleProfile.request';
import { UpsertStyleProfileResponse } from './UpsertStyleProfile.response';

export class UpsertStyleProfileCommand extends Command<UpsertStyleProfileResponse> {
  constructor(
    public readonly userId: string,
    public readonly request: UpsertStyleProfileRequest,
  ) {
    super();
  }
}
