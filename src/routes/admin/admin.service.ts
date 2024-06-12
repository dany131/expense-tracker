import { BadRequestException, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UserModel } from "@models/index";
import { AppHelper, AuthHelper, PaginationHelper } from "@helpers/index";
import { SuccessResponseMessages, ErrorResponseMessages } from "@messages/index";
import { CreateAdminDto } from "@dto/admin";
import { PaginationParamsDto } from "@dto/global";
import { ApiMessageData, ApiMessageDataPagination, FieldSelector, Role } from "@types";
import { AppConstants } from "@constants/app.constants";


@Injectable()
export class AdminService {

  constructor(@InjectModel("User") private readonly User: Model<UserModel>,
              private paginationHelper: PaginationHelper,
              private appHelper: AppHelper,
              private authHelper: AuthHelper) {
  }

  /** Create admin*/
  async createAdmin(createAdminDto: CreateAdminDto): Promise<ApiMessageData> {
    const { name, email, password } = createAdminDto;
    const userExists = await this.User.findOne({ email });
    if (userExists) throw new BadRequestException(ErrorResponseMessages.EMAIL_EXISTS);

    const newAdmin = new this.User({
      name,
      email,
      password: await this.appHelper.hashData(password),
      profilePicture: AppConstants.DEFAULT_IMAGE,
      role: Role.SuperUser,
      isApproved: true,
      refreshToken: "",
      verificationCode: "",
      isDeleted: false
    });

    await newAdmin.save();
    const tokens = await this.authHelper.getTokens(newAdmin._id.toString(), newAdmin.role);

    newAdmin.refreshToken = tokens.refresh_token;
    await newAdmin.save();
    return {
      message: SuccessResponseMessages.CREATED,
      data: {
        _id: newAdmin._id,
        name,
        email,
        profilePicture: newAdmin.profilePicture
      }
    };
  }

  /** Get all admins*/
  async getAdmins(pagination: PaginationParamsDto): Promise<ApiMessageDataPagination> {
    const { page, limit } = pagination;
    const matchingQuery = { role: Role.SuperUser };

    const { data, lastPage, total } = await this.paginationHelper.paginate({
      model: this.User,
      page,
      limit,
      matchingQuery,
      selectFields: FieldSelector.User
    });

    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data, page, lastPage, total };
  }

}
