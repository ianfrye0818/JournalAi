import { Controller } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

@Controller('questions')
@ApiTags('Questions')
export class QuestionsController {
  constructor(private readonly queryBus: QueryBus) {}

  // GET /questions/:id/answer:w
}
