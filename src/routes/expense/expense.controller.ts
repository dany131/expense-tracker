import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ValidateMongoId } from "@pipes/index";
import { ApiMessageDataDto, ApiMessageDataPaginationDto, ApiMessageDto, PaginationParamsDto } from "@dto/global";
import { Request } from "express";
import { ApiMessage, ApiMessageData, ApiMessageDataPagination, Role } from "@types";
import { Roles } from "@decorators/roles.decorator";
import { ExpenseService } from "@routes/expense/expense.service";
import { CreateExpenseDto, UpdateExpenseDto } from "@dto/expense";


@ApiTags("expense")
@ApiBearerAuth("JWT-auth")
@Controller("expense")
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {
  }

  /** Get expense by id*/
  @Get("/")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiMessageDataDto })
  async getExpense(@Query("expenseId", ValidateMongoId) expenseId: string): Promise<ApiMessageData> {
    return await this.expenseService.getExpenseById(expenseId);
  }

  /** Create new expense*/
  @Roles(Role.User)
  @Post("/")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiMessageDataDto })
  async createExpense(@Req() request: Request,
                      @Body() reqBody: CreateExpenseDto): Promise<ApiMessageData> {
    return await this.expenseService.createExpense(request.user.id, reqBody);
  }

  /** Update expense*/
  @Roles(Role.User)
  @Put("/")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiMessageDataDto })
  async updateExpense(@Query("expenseId", ValidateMongoId) expenseId: string,
                      @Req() request: Request,
                      @Body() reqBody: UpdateExpenseDto): Promise<ApiMessageData> {
    return await this.expenseService.updateExpense(expenseId, request.user.id, reqBody);
  }

  /** Delete expense*/
  @Delete("/")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiMessageDto })
  async deleteExpense(@Query("expenseId", ValidateMongoId) expenseId: string): Promise<ApiMessage> {
    return await this.expenseService.deleteExpense(expenseId);
  }

  /** Get all expenses*/
  @Get("all")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiMessageDataPaginationDto })
  async getExpenses(@Req() request: Request,
                    @Query() paginationQuery: PaginationParamsDto): Promise<ApiMessageDataPagination> {
    return await this.expenseService.getExpenses(request.user.id, paginationQuery);
  }

}
