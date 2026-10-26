import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PUBLIC_KEY } from '../decorators/public.decorator';
import { getRequest } from '../lib/utils';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic =
      Reflect.getMetadata(PUBLIC_KEY, context.getHandler()) ||
      Reflect.getMetadata(PUBLIC_KEY, context.getClass());
    if (isPublic) return true;

    const request = getRequest(context);
    if (!request.session.isAuthenticated)
      throw new UnauthorizedException('Unauthorized');

    return true;
  }
}
