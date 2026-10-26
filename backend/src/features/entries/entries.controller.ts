import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  type AuthUser,
} from '@src/decorators/current-user.decorator';
import { SearchEntriesQuery } from './SearchEntries/SearchEntries.query';
import { SearchEntriesRequest } from './SearchEntries/SearchEntries.request';
import { SearchEntriesResponse } from './SearchEntries/SearchEntries.response';
import { UpdateEntryCommand } from './UpdateEntry/UpdateEntry.command';
import { UpdateEntryRequest } from './UpdateEntry/UpdateEntry.request';
import { UpdateEntryResponse } from './UpdateEntry/UpdateEntry.response';

@Controller('entries')
@ApiTags('Entries')
export class EntriesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOkResponse({ type: [SearchEntriesResponse] })
  search(
    @CurrentUser() user: AuthUser,
    @Query() query: SearchEntriesRequest,
  ): Promise<SearchEntriesResponse[]> {
    return this.queryBus.execute(new SearchEntriesQuery(user.id, query));
  }

  @Patch(':id')
  @ApiOkResponse({ type: UpdateEntryResponse })
  @ApiNotFoundResponse({ description: 'No such entry for this user' })
  @ApiConflictResponse({ description: 'The day is finalized' })
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateEntryRequest,
  ): Promise<UpdateEntryResponse> {
    return this.commandBus.execute(new UpdateEntryCommand(user.id, id, body));
  }
}
