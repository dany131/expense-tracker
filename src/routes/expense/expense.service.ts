import { ExpenseModel } from "@models/index";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { PaginationHelper } from "@helpers/index";
import { PaginationParamsDto } from "@dto/global";
import { ErrorResponseMessages, SuccessResponseMessages } from "@messages/index";
import { ApiMessage, ApiMessageData, ApiMessageDataPagination, FieldSelector } from "@types";
import { CreateExpenseDto, UpdateExpenseDto } from "@dto/expense";


@Injectable()
export class ExpenseService {

  constructor(@InjectModel("Expense") private readonly Expense: Model<ExpenseModel>,
              private paginationHelper: PaginationHelper) {
  }

  /** Create expense*/
  async createExpense(userId: string, createExpenseDto: CreateExpenseDto): Promise<ApiMessageData> {
    const { amount, category, date, description, isRecurring } = createExpenseDto;

    const expense = new this.Expense({
      user: userId,
      amount,
      category,
      date,
      description,
      isRecurring
    });

    await expense.save();
    return { message: SuccessResponseMessages.CREATED, data: expense };
  }

  /** Update expense*/
  async updateExpense(expenseId: string, userId: string, updateExpenseDto: UpdateExpenseDto): Promise<ApiMessageData> {
    const { amount, category, date, description, isRecurring } = updateExpenseDto;
    const expense = await this.getExpense(expenseId);
    if (expense.user.toString() !== userId) throw new BadRequestException(ErrorResponseMessages.INVALID_ACTION);

    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.date = date || expense.date;
    expense.description = description || expense.description;
    expense.isRecurring = isRecurring || expense.isRecurring;

    await expense.save();
    return { message: SuccessResponseMessages.CREATED, data: expense };
  }

  /** Get expense by id*/
  async getExpenseById(expenseId: string): Promise<ApiMessageData> {
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: await this.getExpense(expenseId) };
  }

  /** Delete expense*/
  async deleteExpense(expenseId: string): Promise<ApiMessage> {
    await this.getExpense(expenseId);
    await this.Expense.deleteOne({ _id: expenseId });
    return { message: SuccessResponseMessages.SUCCESS_GENERAL };
  }

  /** Get all expenses*/

  /** Internal*/
  public async getExpense(expenseId: string): Promise<ExpenseModel> {
    const expense = await this.Expense.findById(expenseId).populate({ path: "user", select: FieldSelector.User });
    if (!expense) throw new BadRequestException(ErrorResponseMessages.EXPENSE_EXISTS);
    return expense;
  }

}