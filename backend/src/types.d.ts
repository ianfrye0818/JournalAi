import 'express';
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: unknown;
    isAuthenticated?: boolean;
  }
}
