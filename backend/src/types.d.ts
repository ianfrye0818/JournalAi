import 'express';
import type { AuthUser } from './decorators/current-user.decorator';

declare global {
  namespace Express {
    interface Request {
      /** Set by AuthGuard on authenticated routes. */
      user?: AuthUser;
      /** The raw bearer token the request was authenticated with. */
      authToken?: string;
    }
  }
}
