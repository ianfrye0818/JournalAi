import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  @Get()
  @ApiOkResponse({ type: String, description: 'Health check response' })
  getHealth(): string {
    return 'OK';
  }
}
