import { UserModel } from "@models/index";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { AppHelper, AuthHelper, PaginationHelper } from "@helpers/index";
import { PaginationParamsDto } from "@dto/global";
import { ErrorResponseMessages, SuccessResponseMessages } from "@messages/index";
import { ApiMessage, ApiMessageData, ApiMessageDataPagination, FieldSelector, Role } from "@types";
import { ChangePasswordDto, GetUserDto } from "@dto/user";
import { AppConstants } from "@constants/app.constants";
import { SignUpDto } from "@dto/auth";


@Injectable()
export class UserService {
  constructor(@InjectModel("User") private readonly User: Model<UserModel>,
              private appHelper: AppHelper,
              private authHelper: AuthHelper,
              private paginationHelper: PaginationHelper) {
  }

  /** Change password global*/
  async changePassword(userId: string, createUserObj: ChangePasswordDto): Promise<ApiMessage> {
    const { oldPassword, newPassword } = createUserObj;
    const user = await this.getUser({ userId, fields: "-updatedAt" });

    const validOldPassword = await this.appHelper.isValidData(oldPassword, user.password);
    if (!validOldPassword) throw new BadRequestException(ErrorResponseMessages.OLD_PASSWORD);

    const checkOldPassword = await this.appHelper.isValidData(newPassword, user.password);
    if (checkOldPassword) throw new BadRequestException(ErrorResponseMessages.NEW_PASSWORD);

    user.password = await this.appHelper.hashData(newPassword);
    await user.save();
    return { message: SuccessResponseMessages.UPDATED };
  }

  /** Get user by id global*/
  async getUserById(userId: string): Promise<ApiMessageData> {

    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: await this.getUser({ userId }) };
  }

  /** Get all users*/
  async getUsers(pagination: PaginationParamsDto): Promise<ApiMessageDataPagination> {
    const { page, limit } = pagination;

    let matchingQuery: any = { role: { $ne: Role.SuperUser } };

    const { data, lastPage, total } = await this.paginationHelper.paginate({
      model: this.User,
      page,
      limit,
      matchingQuery,
      selectFields: FieldSelector.User
    });

    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data, page, lastPage, total };
  }

  /** Internal,
   * Creates user */
  public async createUser(createUserDto: SignUpDto, isApproved: boolean = false, role: Role = Role.User) {

    const { name, email, password } = createUserDto;

    const userExists = await this.getUser({ email }, false);
    if (userExists) throw new BadRequestException(ErrorResponseMessages.EMAIL_EXISTS);

    const user = new this.User({
      name,
      email,
      password,
      profilePicture: AppConstants.DEFAULT_IMAGE,
      role,
      isApproved,
      refreshToken: "",
      verificationCode: "",
      isDeleted: false
    });

    // Password
    user.password = await this.appHelper.hashData(user.password);
    // Verification Code
    let randomCode: string = "";
    if (!isApproved) {
      randomCode = this.appHelper.generateAlphaNumeric(8);
      user.verificationCode = await this.appHelper.hashData(randomCode);
    }
    await user.save();

    // Tokens
    const tokens = await this.authHelper.getTokens(user._id.toString(), user.role);
    user.refreshToken = tokens.refresh_token;
    await user.save();

    // Omit fields
    user.password = undefined;
    user.isApproved = undefined;
    user.verificationCode = undefined;
    user.refreshToken = undefined;

    return { user, tokens, verificationCode: randomCode };
  }

  public async getUser(getUserDto: GetUserDto, errorIfNot: boolean = true): Promise<UserModel> {
    const { userId, email, fields } = getUserDto;
    const matchingQuery = (userId) ? { _id: userId } : { email };
    const selectFields: string = fields || FieldSelector.User;
    const user = await this.User.findOne(matchingQuery).select(selectFields);
    if (errorIfNot && !user) throw new BadRequestException(ErrorResponseMessages.USER_NOT_EXISTS);
    return user;
  }

}
