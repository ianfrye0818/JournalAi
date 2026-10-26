import { Module } from '@nestjs/common';
import { GetStyleProfileHandler } from './GetStyleProfile/GetStyleProfile.handler';
import { StyleProfileController } from './style-profile.controller';
import { UpsertStyleProfileHandler } from './UpsertStyleProfile/UpsertStyleProfile.handler';

@Module({
  controllers: [StyleProfileController],
  providers: [GetStyleProfileHandler, UpsertStyleProfileHandler],
})
export class StyleProfileModule {}
