import { Module } from "@nestjs/common";
import { SourceController } from "./source.controller";
import { SourceService } from "./source.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SourceSchema } from "@models/source.model";
import { PaginationHelper } from "@helpers/pagination.helper";


@Module({
  imports: [MongooseModule.forFeature([
    { name: "Source", schema: SourceSchema }
  ])],
  controllers: [SourceController],
  providers: [SourceService, PaginationHelper]
})
export class SourceModule {
}
