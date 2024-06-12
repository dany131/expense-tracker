import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SuccessResponseMessages } from "@messages/index";
import { ValidateMongoId } from "@pipes/index";
import { PaginationParamsDto } from "@dto/global";
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
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async getExpense(@Query("expenseId", ValidateMongoId) expenseId: string): Promise<ApiMessageData> {
    return await this.expenseService.getExpenseById(expenseId);
  }

  /** Create new expense*/
  @Roles(Role.User)
  @Post("/")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.CREATED })
  async createExpense(@Req() request: Request,
                      @Body() reqBody: CreateExpenseDto): Promise<ApiMessageData> {
    return await this.expenseService.createExpense(request.user.id, reqBody);
  }

  /** Update expense*/
  @Roles(Role.User)
  @Put("/")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.UPDATED })
  async updateExpense(@Query("expenseId", ValidateMongoId) expenseId: string,
                      @Req() request: Request,
                      @Body() reqBody: UpdateExpenseDto): Promise<ApiMessageData> {
    return await this.expenseService.updateExpense(expenseId, request.user.id, reqBody);
  }

  /** Delete expense*/
  @Delete("/")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async deleteExpense(@Query("expenseId", ValidateMongoId) expenseId: string): Promise<ApiMessage> {
    return await this.expenseService.deleteExpense(expenseId);
  }

}
