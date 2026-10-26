import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

@Controller('transcribe')
@ApiTags('Transcribe')
export class TranscribeController {
  constructor(private readonly commandBus: CommandBus) {}

  // POST /transcribe
}
