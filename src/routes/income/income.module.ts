import { Module } from "@nestjs/common";
import { IncomeController } from "./income.controller";
import { IncomeService } from "./income.service";
import { PaginationHelper } from "@helpers/pagination.helper";
import { MongooseModule } from "@nestjs/mongoose";
import { IncomeSchema } from "@models/income.model";


@Module({
  imports: [MongooseModule.forFeature([
    { name: "Income", schema: IncomeSchema }
  ])],
  controllers: [IncomeController],
  providers: [IncomeService, PaginationHelper]
})
export class IncomeModule {
}
