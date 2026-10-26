import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  type AuthUser,
} from '@src/decorators/current-user.decorator';
import { GetSnippetsSinceQuery } from './GetSnippetsSince/GetSnippetsSince.query';
import { GetSnippetsSinceRequest } from './GetSnippetsSince/GetSnippetsSince.request';
import { GetSnippetsSinceResponse } from './GetSnippetsSince/GetSnippetsSince.response';
import { SyncSnippetsCommand } from './SyncSnippets/SyncSnippets.command';
import { SyncSnippetsRequest } from './SyncSnippets/SyncSnippets.request';
import { SyncSnippetsResponse } from './SyncSnippets/SyncSnippets.response';

@ApiTags('Snippets')
@Controller('snippets')
export class SnippetsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('batch')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SyncSnippetsResponse })
  sync(
    @CurrentUser() user: AuthUser,
    @Body() body: SyncSnippetsRequest,
  ): Promise<SyncSnippetsResponse> {
    return this.commandBus.execute(new SyncSnippetsCommand(user.id, body));
  }

  @Get()
  @ApiOkResponse({ type: GetSnippetsSinceResponse })
  since(
    @CurrentUser() user: AuthUser,
    @Query() query: GetSnippetsSinceRequest,
  ): Promise<GetSnippetsSinceResponse> {
    return this.queryBus.execute(new GetSnippetsSinceQuery(user.id, query));
  }
}
