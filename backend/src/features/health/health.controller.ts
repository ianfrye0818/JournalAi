import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../decorators/public.decorator';

@Controller('health')
@Public()
@ApiTags('Health')
export class HealthController {
  @Get()
  @ApiOkResponse({ type: String, description: 'Health check response' })
  getHealth(): string {
    return 'OK';
  }
}
