import { Body, Controller, Get, HttpCode, HttpStatus, Put, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SuccessResponseMessages } from "@messages/index";
import { ValidateMongoId } from "@pipes/index";
import { PaginationParamsDto } from "@dto/global";
import { UserService } from "@routes/user/user.service";
import { ChangePasswordDto } from "@dto/user";
import { Request } from "express";
import { ApiMessage, ApiMessageData, ApiMessageDataPagination, Role } from "@types";
import { Roles } from "@decorators/roles.decorator";


@ApiTags("user")
@ApiBearerAuth("JWT-auth")
@Controller("user")
export class UserController {
  constructor(private userService: UserService) {
  }

  /** Get user*/
  @Get("/")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getUser(@Query("userId", ValidateMongoId) userId: string): Promise<ApiMessageData> {
    return await this.userService.getUserById(userId);
  }

  /** Get all users*/
  @Get("all")
  @Roles(Role.SuperUser)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getUsers(@Query() paginationQuery: PaginationParamsDto): Promise<ApiMessageDataPagination> {
    return await this.userService.getUsers(paginationQuery);
  }

  /** Change user password*/
  @Put("password")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.UPDATED })
  async changePassword(@Req() request: Request,
                       @Body() reqBody: ChangePasswordDto): Promise<ApiMessage> {
    return await this.userService.changePassword(request.user.id, reqBody);
  }

}