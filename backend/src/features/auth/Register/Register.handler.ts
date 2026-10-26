import { ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/generated';
import { PrismaService } from '@src/services/prisma.service';
import { TokenService } from '@src/services/token.service';
import { hashPassword, normalizeEmail } from '../shared/password';
import { UserResponse } from '../shared/user.response';
import { RegisterCommand } from './Register.command';
import { RegisterResponse } from './Register.response';

const EMAIL_TAKEN = 'Email is already registered';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<
  RegisterCommand,
  RegisterResponse
> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async execute({ request }: RegisterCommand): Promise<RegisterResponse> {
    const email = normalizeEmail(request.email);

    const existing = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) throw new ConflictException(EMAIL_TAKEN);

    const passwordHash = await hashPassword(request.password);
    const user = await this.prisma.user
      .create({ data: { email, passwordHash } })
      .catch((error: unknown) => {
        // Lost a race with a concurrent register for the same email.
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ConflictException(EMAIL_TAKEN);
        }
        throw error;
      });

    const token = await this.tokenService.issue(user.id);
    return { token, user: UserResponse.from(user) };
  }
}
