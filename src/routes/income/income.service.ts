import { IncomeModel } from "@models/index";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { DateHelper, PaginationHelper } from "@helpers/index";
import { PaginationParamsDto } from "@dto/global";
import { ErrorResponseMessages, SuccessResponseMessages } from "@messages/index";
import { ApiMessage, ApiMessageData, ApiMessageDataPagination, FieldSelector } from "@types";
import { CreateIncomeDto, UpdateIncomeDto } from "@dto/income";
import { SourceService } from "@routes/source/source.service";


@Injectable()
export class IncomeService {

  constructor(@InjectModel("Income") private readonly Income: Model<IncomeModel>,
              private paginationHelper: PaginationHelper,
              private dateHelper: DateHelper,
              private readonly sourceService: SourceService) {
  }

  /** Create income*/
  async createIncome(userId: string, createIncomeDto: CreateIncomeDto): Promise<ApiMessageData> {
    const { amount, source, date, description, isRecurring } = createIncomeDto;
    await this.sourceService.getSource(source);

    const income = new this.Income({
      user: userId,
      amount,
      source,
      date: this.dateHelper.getDate(date),
      description,
      isRecurring
    });

    await income.save();
    return { message: SuccessResponseMessages.CREATED, data: income };
  }

  /** Update income*/
  async updateIncome(incomeId: string, userId: string, updateIncomeDto: UpdateIncomeDto): Promise<ApiMessageData> {
    const { amount, source, date, description, isRecurring } = updateIncomeDto;
    const income = await this.getIncome(incomeId);
    if (income.user.toString() !== userId) throw new BadRequestException(ErrorResponseMessages.INVALID_ACTION);

    if (source) {
      const { _id } = await this.sourceService.getSource(source);
      income.source = _id;
    }

    if (date) income.date = this.dateHelper.getDate(date);

    income.amount = amount || income.amount;
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
    await this.Income.updateOne({ _id: incomeId }, { isDeleted: true });
    return { message: SuccessResponseMessages.SUCCESS_GENERAL };
  }

  /** Get all incomes*/
  async getIncomes(userId: string, pagination: PaginationParamsDto): Promise<ApiMessageDataPagination> {
    const { page, limit } = pagination;
    const matchingQuery = { user: userId };

    const { data, lastPage, total } = await this.paginationHelper.paginate({
      model: this.Income,
      page,
      limit,
      matchingQuery,
      populate: [
        { path: "user", select: FieldSelector.User },
        { path: "source" }]
    });

    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data, page, lastPage, total };
  }

  /** Internal*/
  public async getIncome(incomeId: string): Promise<IncomeModel> {
    const income = await this.Income.findById(incomeId)
      .populate({ path: "user", select: FieldSelector.User })
      .populate({ path: "source" });

    if (!income) throw new BadRequestException(ErrorResponseMessages.INCOME_EXISTS);
    return income;
  }
}
