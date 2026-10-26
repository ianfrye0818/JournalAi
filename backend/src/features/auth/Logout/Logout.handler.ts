import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokenService } from '@src/services/token.service';
import { LogoutCommand } from './Logout.command';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand, void> {
  constructor(private readonly tokenService: TokenService) {}

  async execute({ token }: LogoutCommand): Promise<void> {
    await this.tokenService.revoke(token);
  }
}
