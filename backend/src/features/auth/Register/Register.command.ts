import { Command } from '@nestjs/cqrs';
import { RegisterRequest } from './Register.request';
import { RegisterResponse } from './Register.response';

export class RegisterCommand extends Command<RegisterResponse> {
  constructor(public readonly request: RegisterRequest) {
    super();
  }
}
