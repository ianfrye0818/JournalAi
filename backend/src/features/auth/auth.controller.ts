import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';
import {
  CurrentUser,
  type AuthUser,
} from '@src/decorators/current-user.decorator';
import { Public } from '@src/decorators/public.decorator';
import { GetMeQuery } from './GetMe/GetMe.query';
import { GetMeResponse } from './GetMe/GetMe.response';
import { LoginCommand } from './Login/Login.command';
import { LoginRequest } from './Login/Login.request';
import { LoginResponse } from './Login/Login.response';
import { LogoutCommand } from './Logout/Logout.command';
import { RegisterCommand } from './Register/Register.command';
import { RegisterRequest } from './Register/Register.request';
import { RegisterResponse } from './Register/Register.response';

// Per-IP limit on the credential endpoints.
const CREDENTIAL_THROTTLE = { default: { limit: 10, ttl: 60_000 } };

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('register')
  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle(CREDENTIAL_THROTTLE)
  @ApiCreatedResponse({ type: RegisterResponse })
  @ApiTooManyRequestsResponse()
  register(@Body() body: RegisterRequest): Promise<RegisterResponse> {
    return this.commandBus.execute(new RegisterCommand(body));
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle(CREDENTIAL_THROTTLE)
  @ApiOkResponse({ type: LoginResponse })
  @ApiTooManyRequestsResponse()
  login(@Body() body: LoginRequest): Promise<LoginResponse> {
    return this.commandBus.execute(new LoginCommand(body));
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async logout(@Req() req: Request): Promise<void> {
    // authToken is always set once AuthGuard has let the request through.
    await this.commandBus.execute(new LogoutCommand(req.authToken!));
  }

  @Get('me')
  @ApiOkResponse({ type: GetMeResponse })
  me(@CurrentUser() user: AuthUser): Promise<GetMeResponse> {
    return this.queryBus.execute(new GetMeQuery(user.id));
  }
}
