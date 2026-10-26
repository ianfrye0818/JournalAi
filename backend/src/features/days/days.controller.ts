import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadGatewayResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  CurrentUser,
  type AuthUser,
} from '@src/decorators/current-user.decorator';
import { DraftEntryCommand } from './DraftEntry/DraftEntry.command';
import { DraftEntryRequest } from './DraftEntry/DraftEntry.request';
import { DraftEntryResponse } from './DraftEntry/DraftEntry.response';
import { FinalizeDayCommand } from './FinalizeDay/FinalizeDay.command';
import { FinalizeDayRequest } from './FinalizeDay/FinalizeDay.request';
import { FinalizeDayResponse } from './FinalizeDay/FinalizeDay.response';
import { GetDayQuery } from './GetDay/GetDay.query';
import { GetDayRequest } from './GetDay/GetDay.request';
import { GetDayResponse } from './GetDay/GetDay.response';
import { ListDaysQuery } from './ListDays/ListDays.query';
import { ListDaysRequest } from './ListDays/ListDays.request';
import { ListDaysResponse } from './ListDays/ListDays.response';
import { ReopenDayCommand } from './ReopenDay/ReopenDay.command';
import { ReopenDayRequest } from './ReopenDay/ReopenDay.request';
import { ReopenDayResponse } from './ReopenDay/ReopenDay.response';
import { DayDateParams } from './shared/day-date.params';
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

  @Get()
  @ApiOkResponse({ type: [ListDaysResponse] })
  list(
    @CurrentUser() user: AuthUser,
    @Query() query: ListDaysRequest,
  ): Promise<ListDaysResponse[]> {
    return this.queryBus.execute(new ListDaysQuery(user.id, query));
  }

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

  @Post(':date/draft')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: DraftEntryResponse })
  @ApiUnprocessableEntityResponse({ description: 'The day has no snippets' })
  @ApiConflictResponse({ description: 'The day is finalized' })
  @ApiBadGatewayResponse({ description: 'The AI call failed' })
  draft(
    @CurrentUser() user: AuthUser,
    @Param() params: DayDateParams,
    @Body() body: DraftEntryRequest,
  ): Promise<DraftEntryResponse> {
    return this.commandBus.execute(
      new DraftEntryCommand(user.id, user.timezone, params.date, body),
    );
  }

  @Post(':date/finalize')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: FinalizeDayResponse })
  @ApiNotFoundResponse({ description: 'No such day' })
  @ApiUnprocessableEntityResponse({ description: 'The day has no entry yet' })
  finalize(
    @CurrentUser() user: AuthUser,
    @Param() params: FinalizeDayRequest,
  ): Promise<FinalizeDayResponse> {
    return this.commandBus.execute(new FinalizeDayCommand(user.id, params));
  }

  @Post(':date/reopen')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReopenDayResponse })
  @ApiNotFoundResponse({ description: 'No such day' })
  @ApiConflictResponse({ description: 'The day is not finalized' })
  reopen(
    @CurrentUser() user: AuthUser,
    @Param() params: ReopenDayRequest,
  ): Promise<ReopenDayResponse> {
    return this.commandBus.execute(new ReopenDayCommand(user.id, params));
  }
}
