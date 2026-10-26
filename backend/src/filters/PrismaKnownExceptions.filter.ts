import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/client';
import type { Request, Response } from 'express';

const PrismaErrorCodeMap = {
  P2002: 'Unique constraint failed',
  P2003: 'Foreign key constraint failed',
  P2004: 'A database constraint failed',
  P2006: 'A Field Name is not valid',
  P2007: 'Data validation failed',
  P2008: 'Failed to parse query',
  P2011: 'Null Constraint Failed',
  P2012: 'Missing Required Path',
  P2013: 'Missing Required Argument',
  P2015: 'Missing Relationship',
  P2018: 'Related Records Not Found',
  P2024: 'Timout While Waiting For Resource',
  P2022: 'A record with this value already exists',
  P2033:
    "A number used in the query does not fit into a 64 bit signed integer. Consider using BigInt as field type if you're trying to store large integers",
};

@Catch(PrismaClientValidationError)
export class PrismaKnownExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaKnownExceptionFilter.name, {
    timestamp: true,
  });
  catch(exception: PrismaClientValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = HttpStatus.BAD_REQUEST;

    this.logger.error({
      name: exception.name,
      message: exception.message,
      originalPath: request.url,
      responseStatusCode: statusCode,
      responseMessage: exception.message,
    });

    response.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}

@Catch(PrismaClientKnownRequestError)
export class PrismaKnownRequestExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaKnownRequestExceptionFilter.name, {
    timestamp: true,
  });
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = HttpStatus.BAD_REQUEST;

    let message = exception.message;
    const prismaCode = exception.code;
    if (prismaCode in PrismaErrorCodeMap) {
      message =
        PrismaErrorCodeMap[prismaCode as keyof typeof PrismaErrorCodeMap];
    }

    this.logger.error({
      name: exception.name,
      message,
      prismaCode,
      originalPath: request.url,
      responseStatusCode: statusCode,
      responseMessage: exception.message,
    });

    response.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}

@Catch(PrismaClientUnknownRequestError)
export class PrismaUnknownRequestExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(
    PrismaUnknownRequestExceptionFilter.name,
    {
      timestamp: true,
    },
  );
  catch(exception: PrismaClientUnknownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = HttpStatus.BAD_REQUEST;
    this.logger.error({
      name: exception.name,
      message: exception.message,
      originalPath: request.url,
      responseStatusCode: statusCode,
      responseMessage: exception.message,
    });

    response.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
