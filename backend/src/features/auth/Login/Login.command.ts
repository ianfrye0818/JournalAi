import { Command } from '@nestjs/cqrs';
import { LoginRequest } from './Login.request';
import { LoginResponse } from './Login.response';

export class LoginCommand extends Command<LoginResponse> {
  constructor(public readonly request: LoginRequest) {
    super();
  }
}
