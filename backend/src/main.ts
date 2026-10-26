import { NestFactory } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';
import {
  createCorsOptions,
  createGlobalFilters,
  createOpenApiConfig,
  createValidationPipe,
} from './config';
import { AppLogger } from './services/applogger.service';
import { ConfigService } from './services/configService/config.service';

const logger = new AppLogger('JournalAI');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    forceCloseConnections: true,
  });

  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') ?? 3000;
  const isDev = configService.get('NODE_ENV') === 'development';

  if (isDev) {
    app.use((req: Request, _: Response, next: NextFunction) => {
      logger.log({
        params: JSON.stringify(req.params),
        query: JSON.stringify(req.query),
        body: JSON.stringify(req.body, (key: string, value: unknown) =>
          key === 'password' ? '[redacted]' : value,
        ),
        path: req.path,
        method: req.method,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString(),
      });
      return next();
    });
  }

  app.enableCors(createCorsOptions(configService));
  app.useGlobalPipes(createValidationPipe());
  createOpenApiConfig(configService, app);
  createGlobalFilters(app);
  await app.listen(port, () => {
    logger.log(`Server is running on ${port}`);
    logger.log(`Swagger is running on ${port}/api`);
  });
}
bootstrap();
