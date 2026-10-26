import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from './auth.controller';
import { GetMeHandler } from './GetMe/GetMe.handler';
import { LoginHandler } from './Login/Login.handler';
import { LogoutHandler } from './Logout/Logout.handler';
import { RegisterHandler } from './Register/Register.handler';
import { UpdateMeHandler } from './UpdateMe/UpdateMe.handler';
import { DeleteAccountHandler } from './DeleteAccount/DeleteAccount.handler';
import { RequestPasswordResetHandler } from './RequestPasswordReset/RequestPasswordReset.handler';
import { ResetPasswordHandler } from './ResetPassword/ResetPassword.handler';

@Module({
  // Limits are set per route with @Throttle; ThrottlerGuard is only applied
  // to the credential endpoints, not globally.
  imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 10 }])],
  controllers: [AuthController],
  providers: [
    RegisterHandler,
    LoginHandler,
    LogoutHandler,
    GetMeHandler,
    UpdateMeHandler,
    DeleteAccountHandler,
    RequestPasswordResetHandler,
    ResetPasswordHandler,
  ],
})
export class AuthModule {}
