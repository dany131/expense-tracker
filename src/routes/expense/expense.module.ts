import { Module } from "@nestjs/common";
import { ExpenseController } from "./expense.controller";
import { ExpenseService } from "./expense.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ExpenseSchema } from "@models/expense.model";
import { PaginationHelper } from "@helpers/pagination.helper";
import { CategoriesModule } from "@routes/categories/categories.module";
import { DateHelper } from "@helpers/date.helper";


@Module({
  imports: [MongooseModule.forFeature([
    { name: "Expense", schema: ExpenseSchema }
  ]), CategoriesModule],
  controllers: [ExpenseController],
  providers: [ExpenseService, PaginationHelper, DateHelper]
})
export class ExpenseModule {
}
