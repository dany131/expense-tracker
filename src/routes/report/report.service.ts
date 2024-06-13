import { ExpenseModel, IncomeModel } from "@models/index";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { DateHelper } from "@helpers/index";
import { SuccessResponseMessages } from "@messages/index";
import {
  ApiMessageData,
  DateRange,
  ExpensesPdf,
  IncomePdf,
  TimeFrame
} from "@types";
import { GetSummaryDto } from "@dto/report";
import { PdfHelper } from "@helpers/pdf.helper";
import { Response } from "express";
import { take } from "rxjs";


@Injectable()
export class ReportService {
  constructor(@InjectModel("Income") private readonly Income: Model<IncomeModel>,
              @InjectModel("Expense") private readonly Expense: Model<ExpenseModel>,
              private pdfHelper: PdfHelper,
              private dateHelper: DateHelper) {
  }

  /** Get summary*/
  async getSummary(userId: string, getSummaryDto: GetSummaryDto): Promise<ApiMessageData> {
    const { timeFrame } = getSummaryDto;

    let matchingQuery: { user: string, date?: object } = { user: userId };

    const range = this.getDateRange(timeFrame);

    if (range) matchingQuery.date = { $gte: range.start, $lte: range.end };

    const incomes = await this.Income.find(matchingQuery);
    const incomeTotal = incomes.reduce((sum, item) => sum + item.amount, 0);

    const expenses = await this.Expense.find(matchingQuery);
    const expenseTotal = expenses.reduce((sum, item) => sum + item.amount, 0);

    const balance = incomeTotal - expenseTotal;

    return {
      message: SuccessResponseMessages.SUCCESS_GENERAL,
      data: {
        incomeCount: incomes.length,
        incomeTotal,
        expenseCount: expenses.length,
        expenseTotal,
        balance
      }
    };
  }

  /** Download summary*/
  async downloadSummary(userId: string, getSummaryDto: GetSummaryDto, res: Response) {
    const { timeFrame } = getSummaryDto;
    let matchingQuery: { user: string, date?: object } = { user: userId };

    const range = this.getDateRange(timeFrame);

    if (range) matchingQuery.date = { $gte: range.start, $lte: range.end };

    const incomes = await this.Income.find(matchingQuery).populate({ path: "source" });

    const incomeTotal = incomes.reduce((sum, item) => sum + item.amount, 0);

    const expenses = await this.Expense.find(matchingQuery).populate({ path: "category" });

    const expenseTotal = expenses.reduce((sum, item) => sum + item.amount, 0);

    const balance = incomeTotal - expenseTotal;

    const pdfIncomes: IncomePdf[] = incomes.map((income: any) => {
      return {
        date: income.date.toString(),
        amount: income.amount,
        sourceName: income.source.name,
        sourceType: income.source.sourceType
      };
    });

    const pdfExpenses: ExpensesPdf[] = expenses.map((expense: any) => {
      return {
        date: expense.date.toString(),
        amount: expense.amount,
        categoryName: expense.category.name,
        categoryType: expense.category.categoryType
      };
    });

    const pdfDoc = await this.pdfHelper.generateSummaryPdf(
      incomes.length,
      incomeTotal,
      pdfIncomes,
      expenses.length,
      expenseTotal,
      pdfExpenses,
      balance);

    pdfDoc.getBuffer((buffer) => {
      res.setHeader("Content-disposition", "attachment; filename=data.pdf");
      res.setHeader("Content-type", "application/pdf");
      res.send(Buffer.from(buffer));
    });
  }

  /** Internal*/
  private getDateRange(timeFrame: TimeFrame): DateRange | null {
    let dateRange: DateRange;

    switch (timeFrame) {
      case TimeFrame.Today:
        dateRange = this.dateHelper.getToday();
        break;
      case TimeFrame.Week:
        dateRange = this.dateHelper.getThisWeek();
        break;
      case TimeFrame.Month:
        dateRange = this.dateHelper.getThisMonth();
        break;
      case TimeFrame.Year:
        dateRange = this.dateHelper.getThisYear();
        break;
      default:
        dateRange = null;
    }

    return dateRange;
  }
}

