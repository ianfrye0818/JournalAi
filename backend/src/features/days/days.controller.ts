import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

@Controller('days')
@ApiTags('Days')
export class DaysController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // GET /days/:date

  // GET /days/:date/interview

  // POST /days/:date/draft

  // POST /days/:date/finalize
}
