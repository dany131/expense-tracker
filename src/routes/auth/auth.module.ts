import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AppHelper, AuthHelper, LogHelper, MailHelper } from "@helpers/index";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenStrategy, RefreshTokenStrategy } from "@strategies/index";
import { UserModule } from "@routes/user/user.module";


@Module({
  imports: [JwtModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper, AppHelper, MailHelper, AccessTokenStrategy, RefreshTokenStrategy,
    {
      provide: LogHelper,
      useValue: new LogHelper(UserModule.name)
    }
  ]
})
export class AuthModule {
}
