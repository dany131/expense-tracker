import { Module } from "@nestjs/common";
import { SourceController } from "./source.controller";
import { SourceService } from "./source.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SourceSchema } from "@models/source.model";
import { PaginationHelper } from "@helpers/pagination.helper";
import { AppHelper } from "@helpers/app.helper";


@Module({
  imports: [MongooseModule.forFeature([
    { name: "Source", schema: SourceSchema }
  ])],
  controllers: [SourceController],
  providers: [SourceService, PaginationHelper, AppHelper],
  exports: [SourceService]
})
export class SourceModule {
}
