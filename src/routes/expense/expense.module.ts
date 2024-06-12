import { Module } from "@nestjs/common";
import { ExpenseController } from "./expense.controller";
import { ExpenseService } from "./expense.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ExpenseSchema } from "@models/expense.model";
import { PaginationHelper } from "@helpers/pagination.helper";


@Module({
  imports: [MongooseModule.forFeature([
    { name: "Expense", schema: ExpenseSchema }
  ])],
  controllers: [ExpenseController],
  providers: [ExpenseService, PaginationHelper]
})
export class ExpenseModule {
}
