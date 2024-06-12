import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserSchema } from "@models/index";
import { MongooseModule } from "@nestjs/mongoose";
import { AppHelper, AuthHelper, LogHelper, PaginationHelper } from "@helpers/index";
import { JwtService } from "@nestjs/jwt";


@Module({
  imports: [MongooseModule.forFeature([
    { name: "User", schema: UserSchema }
  ])],
  controllers: [UserController],
  providers: [UserService, AppHelper, JwtService, AuthHelper, PaginationHelper,
    {
      provide: LogHelper,
      useValue: new LogHelper(UserModule.name)
    }],
  exports: [UserService]
})

export class UserModule {
}
