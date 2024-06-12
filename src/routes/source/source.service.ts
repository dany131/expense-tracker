import { SourceModel } from "@models/index";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { PaginationHelper } from "@helpers/index";
import { PaginationParamsDto } from "@dto/global";
import { ErrorResponseMessages, SuccessResponseMessages } from "@messages/index";
import { ApiMessage, ApiMessageData, ApiMessageDataPagination, FieldSelector } from "@types";
import { CreateSourceDto, UpdateSourceDto } from "@dto/source";


@Injectable()
export class SourceService {

  constructor(@InjectModel("Source") private readonly Source: Model<SourceModel>,
              private paginationHelper: PaginationHelper) {
  }

  /** Create source*/
  async createSource(userId: string, createSourceDto: CreateSourceDto): Promise<ApiMessageData> {
    const { name, description, sourceType } = createSourceDto;

    const source = new this.Source({
      user: userId,
      name,
      sourceType,
      description
    });

    await source.save();
    return { message: SuccessResponseMessages.CREATED, data: source };
  }

  /** Update source*/
  async updateSource(sourceId: string, userId: string, updateSourceDto: UpdateSourceDto): Promise<ApiMessageData> {
    const { name, description, sourceType } = updateSourceDto;
    const source = await this.getSource(sourceId);
    if (source.user.toString() !== userId) throw new BadRequestException(ErrorResponseMessages.INVALID_ACTION);

    source.name = name || source.name;
    source.sourceType = sourceType || source.sourceType;
    source.description = description || source.description;

    await source.save();

    return { message: SuccessResponseMessages.CREATED, data: source };
  }

  /** Get source by id*/
  async getSourceById(sourceId: string): Promise<ApiMessageData> {
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: await this.getSource(sourceId) };
  }

  /** Delete source*/
  async deleteSource(sourceId: string): Promise<ApiMessage> {
    await this.getSource(sourceId);
    await this.Source.deleteOne({ _id: sourceId });
    return { message: SuccessResponseMessages.SUCCESS_GENERAL };
  }

  /** Get all sources*/

  /** Internal*/
  public async getSource(sourceId: string): Promise<SourceModel> {
    const source = await this.Source.findById(sourceId).populate({ path: "user", select: FieldSelector.User });
    if (!source) throw new BadRequestException(ErrorResponseMessages.SOURCE_EXISTS);
    return source;
  }
}
