import { CategoriesModel } from "@models/index";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { AppHelper, PaginationHelper } from "@helpers/index";
import { PaginationParamsDto } from "@dto/global";
import { ErrorResponseMessages, SuccessResponseMessages } from "@messages/index";
import { ApiMessage, ApiMessageData, ApiMessageDataPagination, FieldSelector } from "@types";
import { CreateCategoryDto, GetCategoriesDto, UpdateCategoryDto } from "@dto/categories";


@Injectable()
export class CategoriesService {

  constructor(@InjectModel("Categories") private readonly Categories: Model<CategoriesModel>,
              private paginationHelper: PaginationHelper,
              private appHelper: AppHelper) {
  }

  /** Create categories*/
  async createCategory(userId: string, createCategoryDto: CreateCategoryDto): Promise<ApiMessageData> {
    const { name, description, categoryType } = createCategoryDto;

    const categories = new this.Categories({
      user: userId,
      name,
      categoryType,
      description,
      isDeleted: false
    });

    await categories.save();
    return { message: SuccessResponseMessages.CREATED, data: categories };
  }

  /** Update category*/
  async updateCategory(categoryId: string, updateCategoryDto: UpdateCategoryDto): Promise<ApiMessageData> {
    const { name, description, categoryType } = updateCategoryDto;
    const category = await this.getCategory(categoryId);

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
    await this.Categories.updateOne({ _id: categoryId }, { isDeleted: true });

    return { message: SuccessResponseMessages.SUCCESS_GENERAL };
  }

  /** Get all categories*/
  async getCategories(userId: string, pagination: PaginationParamsDto, getCategoriesDto: GetCategoriesDto): Promise<ApiMessageDataPagination> {
    const { page, limit } = pagination;
    const { searchQuery } = getCategoriesDto;

    let matchingQuery: { user: string, name?: object } = { user: userId };

    if (searchQuery) matchingQuery.name = { $regex: new RegExp(this.appHelper.escapeRegex(searchQuery), "gi") };

    const { data, lastPage, total } = await this.paginationHelper.paginate({
      model: this.Categories,
      page,
      limit,
      matchingQuery
    });

    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data, page, lastPage, total };
  }

  /** Internal*/
  public async getCategory(categoryId: string): Promise<CategoriesModel> {
    const category = await this.Categories.findById(categoryId).populate({ path: "user", select: FieldSelector.User });
    if (!category) throw new BadRequestException(ErrorResponseMessages.CATEGORY_EXISTS);
    return category;
  }
}
