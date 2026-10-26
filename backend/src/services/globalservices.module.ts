import { Global, Module } from '@nestjs/common';
import { AppLogger } from './applogger.service';
import { EmailService } from './email.service';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';
import { TokenService } from './token.service';

// ConfigService is provided globally by CustomConfigModule (registered in AppModule).
@Global()
@Module({
  providers: [
    AppLogger,
    EmailService,
    PrismaService,
    RedisService,
    TokenService,
  ],
  exports: [AppLogger, EmailService, PrismaService, RedisService, TokenService],
})
export class GlobalServicesModule {}
