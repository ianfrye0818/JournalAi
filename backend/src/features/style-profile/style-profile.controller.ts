import { Body, Controller, Get, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  type AuthUser,
} from '@src/decorators/current-user.decorator';
import { GetStyleProfileQuery } from './GetStyleProfile/GetStyleProfile.query';
import { GetStyleProfileResponse } from './GetStyleProfile/GetStyleProfile.response';
import { UpsertStyleProfileCommand } from './UpsertStyleProfile/UpsertStyleProfile.command';
import { UpsertStyleProfileRequest } from './UpsertStyleProfile/UpsertStyleProfile.request';
import { UpsertStyleProfileResponse } from './UpsertStyleProfile/UpsertStyleProfile.response';

@ApiTags('Style profile')
@Controller('style-profile')
export class StyleProfileController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOkResponse({ type: GetStyleProfileResponse })
  get(@CurrentUser() user: AuthUser): Promise<GetStyleProfileResponse> {
    return this.queryBus.execute(new GetStyleProfileQuery(user.id));
  }

  @Put()
  @ApiOkResponse({ type: UpsertStyleProfileResponse })
  upsert(
    @CurrentUser() user: AuthUser,
    @Body() body: UpsertStyleProfileRequest,
  ): Promise<UpsertStyleProfileResponse> {
    return this.commandBus.execute(
      new UpsertStyleProfileCommand(user.id, body),
    );
  }
}
