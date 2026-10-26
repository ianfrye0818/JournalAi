import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY } from '../decorators/public.decorator';
import { getRequest } from '../lib/utils';
import { PrismaService } from '../services/prisma.service';
import { TokenService } from '../services/token.service';

/**
 * Registered globally as APP_GUARD. Resolves `Authorization: Bearer <token>`
 * to an active user and attaches it to `req.user`. Skips `@Public()` routes.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = getRequest(context);
    const token = this.extractToken(request.headers.authorization);
    if (!token) throw new UnauthorizedException('Unauthorized');

    const userId = await this.tokenService.resolve(token);
    if (!userId) throw new UnauthorizedException('Unauthorized');

    const user = await this.prisma.user.findUnique({
      where: { id: userId, isActive: true },
      select: { id: true, email: true, timezone: true, dayRolloverHour: true },
    });
    if (!user) throw new UnauthorizedException('Unauthorized');

    request.user = user;
    request.authToken = token;
    return true;
  }

  private extractToken(header: string | undefined): string | null {
    const [scheme, token] = header?.split(' ') ?? [];
    return scheme?.toLowerCase() === 'bearer' && token ? token : null;
  }
}
