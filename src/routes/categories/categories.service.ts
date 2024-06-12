import { CategoriesModel } from "@models/index";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { PaginationHelper } from "@helpers/index";
import { PaginationParamsDto } from "@dto/global";
import { ErrorResponseMessages, SuccessResponseMessages } from "@messages/index";
import { ApiMessage, ApiMessageData, ApiMessageDataPagination, FieldSelector } from "@types";
import { CreateCategoryDto, UpdateCategoryDto } from "@dto/categories";


@Injectable()
export class CategoriesService {

  constructor(@InjectModel("Categories") private readonly Categories: Model<CategoriesModel>,
              private paginationHelper: PaginationHelper) {
  }

  /** Create categories*/
  async createCategory(userId: string, createCategoryDto: CreateCategoryDto): Promise<ApiMessageData> {
    const { name, description, categoryType } = createCategoryDto;

    const categories = new this.Categories({
      user: userId,
      name,
      categoryType,
      description
    });

    await categories.save();
    return { message: SuccessResponseMessages.CREATED, data: categories };
  }

  /** Update category*/
  async updateCategory(categoryId: string, userId: string, updateCategoryDto: UpdateCategoryDto): Promise<ApiMessageData> {
    const { name, description, categoryType } = updateCategoryDto;
    const category = await this.getCategory(categoryId);
    if (category.user.toString() !== userId) throw new BadRequestException(ErrorResponseMessages.INVALID_ACTION);

    category.name = name || category.name;
    category.categoryType = categoryType || category.categoryType;
    category.description = description || category.description;

    await category.save();

    return { message: SuccessResponseMessages.CREATED, data: category };
  }

  /** Get category by id*/
  async getCategoryById(categoryId: string): Promise<ApiMessageData> {
    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: await this.getCategory(categoryId) };
  }

  /** Delete category*/
  async deleteCategory(categoryId: string): Promise<ApiMessage> {
    await this.getCategory(categoryId);
    await this.Categories.deleteOne({ _id: categoryId });
    return { message: SuccessResponseMessages.SUCCESS_GENERAL };
  }

  /** Get all categories*/

  /** Internal*/
  public async getCategory(categoryId: string): Promise<CategoriesModel> {
    const category = await this.Categories.findById(categoryId).populate({ path: "user", select: FieldSelector.User });
    if (!category) throw new BadRequestException(ErrorResponseMessages.CATEGORY_EXISTS);
    return category;
  }
}
