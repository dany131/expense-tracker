import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SuccessResponseMessages } from "@messages/index";
import { ValidateMongoId } from "@pipes/index";
import { PaginationParamsDto } from "@dto/global";
import { Request } from "express";
import { ApiMessage, ApiMessageData, ApiMessageDataPagination, Role } from "@types";
import { Roles } from "@decorators/roles.decorator";
import { CategoriesService } from "@routes/categories/categories.service";
import { CreateCategoryDto, UpdateCategoryDto } from "@dto/categories";


@ApiTags("categories")
@ApiBearerAuth("JWT-auth")
@Controller("categories")
export class CategoriesController {

  constructor(private categoriesService: CategoriesService) {
  }

  /** Get category by id*/
  @Get("/")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getCategoryById(@Query("categoryId", ValidateMongoId) categoryId: string): Promise<ApiMessageData> {
    return await this.categoriesService.getCategoryById(categoryId);
  }

  /** Create new category*/
  @Roles(Role.User)
  @Post("/")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.CREATED })
  async createCategory(@Req() request: Request,
                       @Body() reqBody: CreateCategoryDto): Promise<ApiMessageData> {
    return await this.categoriesService.createCategory(request.user.id, reqBody);
  }

  /** Update category*/
  @Roles(Role.User)
  @Put("/")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.UPDATED })
  async updateCategory(@Query("categoryId", ValidateMongoId) categoryId: string,
                       @Req() request: Request,
                       @Body() reqBody: UpdateCategoryDto): Promise<ApiMessageData> {
    return await this.categoriesService.updateCategory(categoryId, request.user.id, reqBody);
  }

  /** Delete category*/
  @Delete("/")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async deleteCategory(@Query("categoryId", ValidateMongoId) categoryId: string): Promise<ApiMessage> {
    return await this.categoriesService.deleteCategory(categoryId);
  }
}
