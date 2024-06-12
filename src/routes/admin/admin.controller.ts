import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiExcludeController, ApiResponse } from "@nestjs/swagger";
import { AdminService } from "@routes/admin/admin.service";
import { SuccessResponseMessages } from "@messages/success-response.messages";
import { CreateAdminDto } from "@dto/admin";
import { Public } from "@decorators/public.decorator";
import { PaginationParamsDto } from "@dto/global";
import { Role } from "@types";
import { Roles } from "@decorators/roles.decorator";


@ApiExcludeController()
@Controller("admin")
export class AdminController {
  constructor(private adminService: AdminService) {
  }

  @Public()
  @Post("/")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.CREATED })
  async createAdmin(@Body() reqBody: CreateAdminDto) {
    return await this.adminService.createAdmin(reqBody);
  }

  @Get("all")
  @Roles(Role.SuperUser)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getAdmins(@Query() paginationQuery: PaginationParamsDto) {
    return await this.adminService.getAdmins(paginationQuery);
  }

}
