import { IncomeModel } from "@models/index";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { PaginationHelper } from "@helpers/index";
import { PaginationParamsDto } from "@dto/global";
import { ErrorResponseMessages, SuccessResponseMessages } from "@messages/index";
import { ApiMessage, ApiMessageData, ApiMessageDataPagination, FieldSelector } from "@types";
import { CreateIncomeDto, UpdateIncomeDto } from "@dto/income";
import { SourceService } from "@routes/source/source.service";
import { GetSummaryDto } from "@dto/report";


@Injectable()
export class ReportService {
  constructor(@InjectModel("Income") private readonly Income: Model<IncomeModel>,
              private paginationHelper: PaginationHelper,
              private readonly sourceService: SourceService) {
  }

  // Get summary
  async getSummary(userId: string, pagination: PaginationParamsDto, getSummaryDto: GetSummaryDto): Promise<ApiMessageDataPagination> {
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

  // Download summary
}

