import { Test } from '@nestjs/testing';
import { TokenService } from '@src/services/token.service';
import { LogoutCommand } from './Logout.command';
import { LogoutHandler } from './Logout.handler';

describe(LogoutHandler, () => {
  let handler: LogoutHandler;
  const tokenService = { revoke: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        LogoutHandler,
        { provide: TokenService, useValue: tokenService },
      ],
    }).compile();

    handler = moduleRef.get(LogoutHandler);
  });

  it('revokes the token the request was authenticated with', async () => {
    await handler.execute(new LogoutCommand('the-token'));

    expect(tokenService.revoke).toHaveBeenCalledWith('the-token');
  });
});
