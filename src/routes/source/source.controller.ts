import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ValidateMongoId } from "@pipes/index";
import { ApiMessageDataDto, ApiMessageDataPaginationDto, ApiMessageDto, PaginationParamsDto } from "@dto/global";
import { Request } from "express";
import { ApiMessage, ApiMessageData, ApiMessageDataPagination, Role } from "@types";
import { Roles } from "@decorators/roles.decorator";
import { SourceService } from "@routes/source/source.service";
import { CreateSourceDto, GetAllSourcesDto, UpdateSourceDto } from "@dto/source";


@ApiTags("source")
@ApiBearerAuth("JWT-auth")
@Controller("source")
export class SourceController {
  constructor(private sourceService: SourceService) {
  }

  /** Get source by id*/
  @Get("/")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiMessageDataDto })
  async getSourceById(@Query("sourceId", ValidateMongoId) sourceId: string): Promise<ApiMessageData> {
    return await this.sourceService.getSourceById(sourceId);
  }

  /** Create new source*/
  @Roles(Role.User)
  @Post("/")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiMessageDataDto })
  async createSource(@Req() request: Request,
                     @Body() reqBody: CreateSourceDto): Promise<ApiMessageData> {
    return await this.sourceService.createSource(request.user.id, reqBody);
  }

  /** Update source*/
  @Roles(Role.User)
  @Put("/")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiMessageDataDto })
  async updateSource(@Query("sourceId", ValidateMongoId) sourceId: string,
                     @Body() reqBody: UpdateSourceDto): Promise<ApiMessageData> {
    return await this.sourceService.updateSource(sourceId, reqBody);
  }

  /** Delete source*/
  @Delete("/")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiMessageDto })
  async deleteSource(@Query("sourceId", ValidateMongoId) sourceId: string): Promise<ApiMessage> {
    return await this.sourceService.deleteSource(sourceId);
  }

  /** Get all sources*/
  @Get("all")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiMessageDataPaginationDto })
  async getSources(@Req() request: Request,
                   @Query() paginationQuery: PaginationParamsDto,
                   @Query() filtrationQuery: GetAllSourcesDto): Promise<ApiMessageDataPagination> {
    return await this.sourceService.getSources(request.user.id, paginationQuery, filtrationQuery);
  }

}
