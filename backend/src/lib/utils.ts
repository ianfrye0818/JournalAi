import { ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';
import { isNil, isString } from 'lodash';

export const getRequest = (context: ExecutionContext): Request => {
  return context.switchToHttp().getRequest();
};
export const getResponse = (context: ExecutionContext): Response =>
  context.switchToHttp().getResponse() as Response;

export class JsonSerializer {
  public static serialize(obj: any) {
    if (isNil(obj) || isString(obj)) return obj;

    return JSON.stringify(obj);
  }

  public static deserialize<T = unknown>(json: string): T {
    if (isNil(json) || !isString(json)) return json as T;
    return JSON.parse(json) as T;
  }
}
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const formatError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};
