import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadGatewayResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  CurrentUser,
  type AuthUser,
} from '@src/decorators/current-user.decorator';
import { GetDayQuery } from './GetDay/GetDay.query';
import { GetDayRequest } from './GetDay/GetDay.request';
import { GetDayResponse } from './GetDay/GetDay.response';
import { StartInterviewRoundCommand } from './StartInterviewRound/StartInterviewRound.command';
import { StartInterviewRoundRequest } from './StartInterviewRound/StartInterviewRound.request';
import { StartInterviewRoundResponse } from './StartInterviewRound/StartInterviewRound.response';

@ApiTags('Days')
@Controller('days')
export class DaysController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':date')
  @ApiOkResponse({ type: GetDayResponse })
  get(
    @CurrentUser() user: AuthUser,
    @Param() params: GetDayRequest,
  ): Promise<GetDayResponse> {
    return this.queryBus.execute(new GetDayQuery(user.id, params));
  }

  @Post(':date/interview')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: StartInterviewRoundResponse })
  @ApiUnprocessableEntityResponse({ description: 'The day has no snippets' })
  @ApiConflictResponse({ description: 'The day is past interviewing' })
  @ApiBadGatewayResponse({ description: 'The AI call failed' })
  interview(
    @CurrentUser() user: AuthUser,
    @Param() params: StartInterviewRoundRequest,
  ): Promise<StartInterviewRoundResponse> {
    return this.commandBus.execute(
      new StartInterviewRoundCommand(user.id, user.timezone, params),
    );
  }

  // POST /days/:date/draft

  // POST /days/:date/finalize
}
