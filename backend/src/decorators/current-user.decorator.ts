import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { User } from '@prisma/generated';
import { getRequest } from '../lib/utils';

/** The user attached to `req.user` by `AuthGuard`. */
export type AuthUser = Pick<
  User,
  'id' | 'email' | 'timezone' | 'dayRolloverHour'
>;

/** Injects the authenticated user. Only valid on routes guarded by `AuthGuard`. */
export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): AuthUser => {
    const user = getRequest(context).user;
    if (!user) throw new UnauthorizedException('Unauthorized');
    return user;
  },
);
