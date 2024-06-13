import { Module } from "@nestjs/common";
import { IncomeController } from "./income.controller";
import { IncomeService } from "./income.service";
import { PaginationHelper } from "@helpers/pagination.helper";
import { MongooseModule } from "@nestjs/mongoose";
import { IncomeSchema } from "@models/income.model";
import { SourceModule } from "@routes/source/source.module";


@Module({
  imports: [MongooseModule.forFeature([
    { name: "Income", schema: IncomeSchema }
  ]), SourceModule],
  controllers: [IncomeController],
  providers: [IncomeService, PaginationHelper]
})
export class IncomeModule {
}
