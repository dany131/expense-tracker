import { Module } from "@nestjs/common";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";
import { MongooseModule } from "@nestjs/mongoose";
import { IncomeSchema } from "@models/income.model";
import { ExpenseSchema } from "@models/expense.model";
import { PdfHelper } from "@helpers/pdf.helper";
import { DateHelper } from "@helpers/date.helper";


@Module({
  imports: [MongooseModule.forFeature([
    { name: "Income", schema: IncomeSchema },
    { name: "Expense", schema: ExpenseSchema }
  ])],
  controllers: [ReportController],
  providers: [ReportService, PdfHelper, DateHelper]
})
export class ReportModule {
}
