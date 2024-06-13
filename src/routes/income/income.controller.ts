import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ValidateMongoId } from "@pipes/index";
import { ApiMessageDataDto, ApiMessageDataPaginationDto, ApiMessageDto, PaginationParamsDto } from "@dto/global";
import { Request } from "express";
import { ApiMessage, ApiMessageData, ApiMessageDataPagination, Role } from "@types";
import { Roles } from "@decorators/roles.decorator";
import { IncomeService } from "@routes/income/income.service";
import { CreateIncomeDto, UpdateIncomeDto } from "@dto/income";


@ApiTags("income")
@ApiBearerAuth("JWT-auth")
@Controller("income")
export class IncomeController {

  constructor(private incomeService: IncomeService) {
  }

  /** Get income by id*/
  @Get("/")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiMessageDataDto })
  async getIncomeById(@Query("incomeId", ValidateMongoId) incomeId: string): Promise<ApiMessageData> {
    return await this.incomeService.getIncomeById(incomeId);
  }

  /** Create new income*/
  @Roles(Role.User)
  @Post("/")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiMessageDataDto })
  async createIncome(@Req() request: Request,
                     @Body() reqBody: CreateIncomeDto): Promise<ApiMessageData> {
    return await this.incomeService.createIncome(request.user.id, reqBody);
  }

  /** Update income*/
  @Roles(Role.User)
  @Put("/")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiMessageDataDto })
  async updateIncome(@Query("incomeId", ValidateMongoId) incomeId: string,
                     @Req() request: Request,
                     @Body() reqBody: UpdateIncomeDto): Promise<ApiMessageData> {
    return await this.incomeService.updateIncome(incomeId, request.user.id, reqBody);
  }

  /** Delete income*/
  @Delete("/")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiMessageDto })
  async deleteIncome(@Query("incomeId", ValidateMongoId) incomeId: string): Promise<ApiMessage> {
    return await this.incomeService.deleteIncome(incomeId);
  }

  @Get("all")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiMessageDataPaginationDto })
  async getIncomes(@Req() request: Request,
                   @Query() paginationQuery: PaginationParamsDto): Promise<ApiMessageDataPagination> {
    return await this.incomeService.getIncomes(request.user.id, paginationQuery);
  }

}

