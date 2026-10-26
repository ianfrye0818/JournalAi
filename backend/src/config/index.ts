import { CorsOptions, CorsOptionsDelegate } from '@nestjs/common/internal';
import { ConfigService } from '../services/configService/config.service';

export const createCorsOptions = (
  configService: ConfigService,
): CorsOptions | CorsOptionsDelegate<any> => {
  return {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      configService.getAll().FRONTEND_URL,
      ...(process.env.CORS_ORIGIN ? JSON.parse(process.env.CORS_ORIGIN) : []),
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Forwarded-Proto',
      'X-Forwarded-Host',
      'X-Forwarded-For',
      'X-API-KEY',
      ...(process.env.CORS_ALLOWED_HEADERS
        ? JSON.parse(process.env.CORS_ALLOWED_HEADERS)
        : []),
    ],
    exposedHeaders: [
      'Content-Range',
      'X-Total-Count',
      ...(process.env.CORS_EXPOSED_HEADERS
        ? JSON.parse(process.env.CORS_EXPOSED_HEADERS)
        : []),
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 600,
  };
};

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  INestApplication,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  PrismaKnownExceptionFilter,
  PrismaKnownRequestExceptionFilter,
  PrismaUnknownRequestExceptionFilter,
} from '../filters/PrismaKnownExceptions.filter';

export const createGlobalFilters = (app: INestApplication) => {
  app.useGlobalFilters(new PrismaKnownExceptionFilter());
  app.useGlobalFilters(new PrismaKnownRequestExceptionFilter());
  app.useGlobalFilters(new PrismaUnknownRequestExceptionFilter());
};

export const createOpenApiConfig = (
  configService: ConfigService,
  app: INestApplication,
) => {
  const isDev = configService.get('NODE_ENV') === 'development';
  const swaggerConfig = new DocumentBuilder()
    .setTitle('JournalAI API')
    .setDescription('JournalAI API Documentation')
    .setVersion(process.env.VERSION ?? '1.0.0')
    .addGlobalResponse({
      type: BadRequestException,
      status: HttpStatus.BAD_REQUEST,
    })
    .addGlobalResponse({
      type: UnauthorizedException,
      status: HttpStatus.UNAUTHORIZED,
    })
    .addGlobalResponse({
      type: ForbiddenException,
      status: HttpStatus.FORBIDDEN,
    })
    .addGlobalResponse({
      type: NotFoundException,
      status: HttpStatus.NOT_FOUND,
    })
    .addGlobalResponse({
      type: ConflictException,
      status: HttpStatus.CONFLICT,
    })
    .addGlobalResponse({
      type: InternalServerErrorException,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    })
    // Every route needs a bearer token unless it is marked @Public().
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'opaque' })
    .addSecurityRequirements('bearer')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, swaggerConfig);

  if (isDev) {
    SwaggerModule.setup('/api/swagger', app, documentFactory, {
      jsonDocumentUrl: '/api/swagger/json',
    });
  }
};
export const createValidationPipe = () => {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  });
};
