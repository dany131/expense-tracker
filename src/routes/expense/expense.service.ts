import { ExpenseModel } from "@models/index";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { DateHelper, PaginationHelper } from "@helpers/index";
import { PaginationParamsDto } from "@dto/global";
import { ErrorResponseMessages, SuccessResponseMessages } from "@messages/index";
import { ApiMessage, ApiMessageData, ApiMessageDataPagination, FieldSelector } from "@types";
import { CreateExpenseDto, UpdateExpenseDto } from "@dto/expense";
import { CategoriesService } from "@routes/categories/categories.service";


@Injectable()
export class ExpenseService {

  constructor(@InjectModel("Expense") private readonly Expense: Model<ExpenseModel>,
              private paginationHelper: PaginationHelper,
              private dateHelper: DateHelper,
              private readonly categoriesService: CategoriesService) {
  }

  /** Create expense*/
  async createExpense(userId: string, createExpenseDto: CreateExpenseDto): Promise<ApiMessageData> {
    const { amount, category, date, description, isRecurring } = createExpenseDto;
    await this.categoriesService.getCategory(category);

    const expense = new this.Expense({
      user: userId,
      amount,
      category,
      date: this.dateHelper.getDate(date),
      description,
      isRecurring
    });

    await expense.save();
    return { message: SuccessResponseMessages.CREATED, data: expense };
  }

  /** Update expense*/
  async updateExpense(expenseId: string, updateExpenseDto: UpdateExpenseDto): Promise<ApiMessageData> {
    const { amount, category, date, description, isRecurring } = updateExpenseDto;
    const expense = await this.getExpense(expenseId);

    if (category) {
      const { _id } = await this.categoriesService.getCategory(category);
      expense.category = _id;
    }

    if (date) expense.date = this.dateHelper.getDate(date);

    expense.amount = amount || expense.amount;
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
    await this.Expense.updateOne({ _id: expenseId }, { isDeleted: true });
    return { message: SuccessResponseMessages.SUCCESS_GENERAL };
  }

  /** Get all expenses*/
  async getExpenses(userId: string, pagination: PaginationParamsDto): Promise<ApiMessageDataPagination> {
    const { page, limit } = pagination;
    const matchingQuery = { user: userId };

    const { data, lastPage, total } = await this.paginationHelper.paginate({
      model: this.Expense,
      page,
      limit,
      matchingQuery,
      populate: [
        { path: "user", select: FieldSelector.User },
        { path: "category" }]
    });

    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data, page, lastPage, total };
  }

  /** Internal*/
  public async getExpense(expenseId: string): Promise<ExpenseModel> {
    const expense = await this.Expense.findById(expenseId)
      .populate({ path: "user", select: FieldSelector.User })
      .populate({ path: "category" });
    if (!expense) throw new BadRequestException(ErrorResponseMessages.EXPENSE_EXISTS);
    return expense;
  }

}