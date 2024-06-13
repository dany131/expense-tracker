import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ValidateMongoId } from "@pipes/index";
import { ApiMessageDataDto, ApiMessageDataPaginationDto, ApiMessageDto, PaginationParamsDto } from "@dto/global";
import { Request } from "express";
import { ApiMessage, ApiMessageData, ApiMessageDataPagination, Role } from "@types";
import { Roles } from "@decorators/roles.decorator";
import { CategoriesService } from "@routes/categories/categories.service";
import { CreateCategoryDto, GetCategoriesDto, UpdateCategoryDto } from "@dto/categories";


@ApiTags("categories")
@ApiBearerAuth("JWT-auth")
@Controller("categories")
export class CategoriesController {

  constructor(private categoriesService: CategoriesService) {
  }

  /** Get category by id*/
  @Get("/")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiMessageDataDto })
  async getCategoryById(@Query("categoryId", ValidateMongoId) categoryId: string): Promise<ApiMessageData> {
    return await this.categoriesService.getCategoryById(categoryId);
  }

  /** Create new category*/
  @Roles(Role.User)
  @Post("/")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiMessageDataDto })
  async createCategory(@Req() request: Request,
                       @Body() reqBody: CreateCategoryDto): Promise<ApiMessageData> {
    return await this.categoriesService.createCategory(request.user.id, reqBody);
  }

  /** Update category*/
  @Roles(Role.User)
  @Put("/")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiMessageDataDto })
  async updateCategory(@Query("categoryId", ValidateMongoId) categoryId: string,
                       @Req() request: Request,
                       @Body() reqBody: UpdateCategoryDto): Promise<ApiMessageData> {
    return await this.categoriesService.updateCategory(categoryId, request.user.id, reqBody);
  }

  /** Delete category*/
  @Delete("/")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiMessageDto })
  async deleteCategory(@Req() request: Request,
                       @Query("categoryId", ValidateMongoId) categoryId: string): Promise<ApiMessage> {
    return await this.categoriesService.deleteCategory(request.user.id, categoryId);
  }

  /** Get all categories*/
  @Get("all")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiMessageDataPaginationDto })
  async getCategories(@Req() request: Request,
                      @Query() paginationQuery: PaginationParamsDto,
                      @Query() filtrationQuery: GetCategoriesDto): Promise<ApiMessageDataPagination> {
    return await this.categoriesService.getCategories(request.user.id, paginationQuery, filtrationQuery);
  }

}
