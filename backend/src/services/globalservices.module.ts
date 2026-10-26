import { Global, Module } from '@nestjs/common';
import { AppLogger } from './applogger.service';
import { ConfigService } from './configService/config.service';
import { EmailService } from './email.service';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    AppLogger,
    ConfigService,
    EmailService,
    PrismaService,
    RedisService,
  ],
  exports: [
    AppLogger,
    ConfigService,
    EmailService,
    PrismaService,
    RedisService,
  ],
})
export class GlobalServicesModule {}
