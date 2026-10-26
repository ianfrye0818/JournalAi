/**
 * Hand-written mirrors of the backend response classes (`backend/src/features/**\/*.response.ts`).
 * Dates arrive as ISO strings over JSON. Keep in sync until codegen lands (see plans backlog).
 */

/** `UserResponse` / `GetMeResponse` */
export type User = {
  id: string;
  email: string;
  timezone: string;
  /** Local hour a new day starts. */
  dayRolloverHour: number;
  createdAt: string;
};

/** `AuthTokenResponse` (returned by register and login) */
export type AuthTokenResponse = {
  /** Opaque bearer token. */
  token: string;
  user: User;
};

/** Body of `RegisterRequest` and `LoginRequest`. */
export type Credentials = {
  email: string;
  password: string;
};

/** NestJS default error body. Validation errors put one message per failed constraint in an array. */
export type ApiErrorBody = {
  statusCode: number;
  message: string | string[];
  error?: string;
};
