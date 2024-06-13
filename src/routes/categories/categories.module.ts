import { Module } from "@nestjs/common";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { MongooseModule } from "@nestjs/mongoose";
import { CategoriesSchema } from "@models/categories.model";
import { PaginationHelper } from "@helpers/pagination.helper";
import { AppHelper } from "@helpers/app.helper";


@Module({
  imports: [MongooseModule.forFeature([
    { name: "Categories", schema: CategoriesSchema }
  ])],
  controllers: [CategoriesController],
  providers: [CategoriesService, PaginationHelper, AppHelper],
  exports: [CategoriesService]
})
export class CategoriesModule {
}
