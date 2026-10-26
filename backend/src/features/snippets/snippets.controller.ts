import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

@Controller('snippets')
@ApiTags('Snippets')
export class SnippetsController {
  constructor(private readonly commandBus: CommandBus) {}

  // POST /snippets/batch
}
