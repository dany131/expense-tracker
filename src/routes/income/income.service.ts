import { IncomeModel } from "@models/index";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { PaginationHelper } from "@helpers/index";
import { PaginationParamsDto } from "@dto/global";
import { ErrorResponseMessages, SuccessResponseMessages } from "@messages/index";
import { ApiMessage, ApiMessageData, ApiMessageDataPagination, FieldSelector } from "@types";
import { CreateIncomeDto, UpdateIncomeDto } from "@dto/income";


@Injectable()
export class IncomeService {

  constructor(@InjectModel("Income") private readonly Income: Model<IncomeModel>,
              private paginationHelper: PaginationHelper) {
  }

  /** Create income*/
  async createIncome(userId: string, createIncomeDto: CreateIncomeDto): Promise<ApiMessageData> {
    const { amount, category, date, description, isRecurring } = createIncomeDto;

    const income = new this.Income({
      user: userId,
      amount,
      category,
      date,
      description,
      isRecurring
    });

    await income.save();
    return { message: SuccessResponseMessages.CREATED, data: income };
  }

  /** Update income*/
  async updateIncome(incomeId: string, userId: string, updateIncomeDto: UpdateIncomeDto): Promise<ApiMessageData> {
    const { amount, category, date, description, isRecurring } = updateIncomeDto;
    const income = await this.getIncome(incomeId);
    if (income.user.toString() !== userId) throw new BadRequestException(ErrorResponseMessages.INVALID_ACTION);

    income.amount = amount || income.amount;
    income.category = category || income.category;
    income.date = date || income.date;
    income.description = description || income.description;
    income.isRecurring = isRecurring || income.isRecurring;

    await income.save();
    return { message: SuccessResponseMessages.CREATED, data: income };
  }

  /** Get income by id*/
  async getIncomeById(incomeId: string): Promise<ApiMessageData> {
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: await this.getIncome(incomeId) };
  }

  /** Delete income*/
  async deleteIncome(incomeId: string): Promise<ApiMessage> {
    await this.getIncome(incomeId);
    await this.Income.deleteOne({ _id: incomeId });
    return { message: SuccessResponseMessages.SUCCESS_GENERAL };
  }

  /** Get all incomes*/

  /** Internal*/
  public async getIncome(incomeId: string): Promise<IncomeModel> {
    const income = await this.Income.findById(incomeId).populate({ path: "user", select: FieldSelector.User });
    if (!income) throw new BadRequestException(ErrorResponseMessages.INCOME_EXISTS);
    return income;
  }
}
