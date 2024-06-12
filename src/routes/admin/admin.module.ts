import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "@models/index";
import { AppHelper, AuthHelper, PaginationHelper } from "@helpers/index";
import { JwtService } from "@nestjs/jwt";


@Module({
  imports: [MongooseModule.forFeature([
    { name: "User", schema: UserSchema }
  ])],
  controllers: [AdminController],
  providers: [AdminService, AppHelper, JwtService, PaginationHelper, AuthHelper]
})
export class AdminModule {
}
