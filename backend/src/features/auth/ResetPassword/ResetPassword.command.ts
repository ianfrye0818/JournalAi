import { Command } from '@nestjs/cqrs';
import { ResetPasswordRequest } from './ResetPassword.request';
import { ResetPasswordResponse } from './ResetPassword.response';

export class ResetPasswordCommand extends Command<ResetPasswordResponse> {
  constructor(public readonly request: ResetPasswordRequest) {
    super();
  }
}
