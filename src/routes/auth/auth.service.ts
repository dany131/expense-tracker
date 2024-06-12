import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AppHelper, AuthHelper, MailHelper } from "@helpers/index";
import { ErrorResponseMessages, MailResponseMessages, SuccessResponseMessages } from "@messages/index";
import { EmailVerificationDto, ForgotPassChangeDto, ForgotPasswordDto, LoginDto, SignUpDto } from "@dto/auth";
import { ApiMessage, ApiMessageData, Role } from "@types";
import { UserService } from "@routes/user/user.service";
import { Request } from "express";


@Injectable()
export class AuthService {

  constructor(private appHelper: AppHelper,
              private authHelper: AuthHelper,
              private mailHelper: MailHelper,
              private readonly userService: UserService) {
  }

  /** Sign up user, Sends email notification*/
  async signUp(signUpObj: SignUpDto): Promise<ApiMessageData> {
    const { user, tokens, verificationCode } = await this.userService.createUser(signUpObj, false, Role.User);

    // Verification email
    this.mailHelper.sendEmail(user.email, MailResponseMessages.VERIFY_EMAIL_SUB,
      MailResponseMessages.VERIFY_EMAIL_TEXT, verificationCode,
      MailResponseMessages.VERIFY_EMAIL_FOOTER);

    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: { user, tokens } };
  }

  async login(loginObj: LoginDto): Promise<ApiMessageData> {

    const { email, password } = loginObj;

    const user = await this.userService.getUser({ email, fields: "-verificationCode -updatedAt -isDeleted" });

    const passwordMatches = await this.appHelper.isValidData(password, user.password);
    if (!passwordMatches) throw new BadRequestException(ErrorResponseMessages.INVALID_PASSWORD);

    const tokens = await this.authHelper.getTokens(user._id.toString(), user.role);
    user.refreshToken = tokens.refresh_token;
    await user.save();

    user.password = undefined;
    user.refreshToken = undefined;

    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: { user, tokens } };
  }

  async logout(req: Request): Promise<ApiMessage> {
    const userId = req.user.id;
    const user = await this.userService.getUser({ userId });
    user.refreshToken = "";
    await user.save();

    return { message: SuccessResponseMessages.SUCCESS_GENERAL };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<ApiMessageData> {
    const user = await this.userService.getUser({ userId });

    if (!user.refreshToken) throw new ForbiddenException(ErrorResponseMessages.ACCESS_DENIED);
    if (refreshToken !== user.refreshToken) throw new UnauthorizedException(ErrorResponseMessages.INVALID_REFRESH_TOKEN);

    const tokens = await this.authHelper.getTokens(userId, user.role);
    user.refreshToken = tokens.refresh_token;
    await user.save();

    return { message: SuccessResponseMessages.SUCCESS_GENERAL, data: { tokens } };
  }

  /** Verify user email*/
  async emailVerification(userId: string, emailVerificationObj: EmailVerificationDto): Promise<ApiMessage> {
    const { verificationCode } = emailVerificationObj;

    const user = await this.userService.getUser({ userId, fields: "-updatedAt" });
    if (user.isApproved) throw new BadRequestException(ErrorResponseMessages.ACCOUNT_VERIFIED);

    // checking user verification code with hashed code stored in the database
    const validCode = await this.appHelper.isValidData(verificationCode, user.verificationCode);
    if (!validCode) throw new BadRequestException(ErrorResponseMessages.INVALID_CODE);
    user.isApproved = true;
    user.verificationCode = "";
    await user.save();
    return { message: SuccessResponseMessages.ACCOUNT_VERIFICATION };
  }

  /** Sends email notification*/
  async forgotPassword(forgotPasswordObj: ForgotPasswordDto): Promise<ApiMessage> {
    const { email } = forgotPasswordObj;
    const user = await this.userService.getUser({ email });

    // generating random code for verification
    const randomCode = this.appHelper.generateAlphaNumeric(8);
    user.verificationCode = await this.appHelper.hashData(randomCode);
    await user.save();

    this.mailHelper.sendEmail(email, MailResponseMessages.FORGOT_PASS_SUB, MailResponseMessages.FORGOT_PASS_TEXT, randomCode, "");

    return { message: SuccessResponseMessages.VERIFICATION_CODE_SENT };
  }

  /** Change password after receiving code on email*/
  async forgotPasswordChange(forgotPassChangeObj: ForgotPassChangeDto): Promise<ApiMessage> {
    const { email, verificationCode, password } = forgotPassChangeObj;
    const user = await this.userService.getUser({ email, fields: "-updatedAt" });

    // checking user verification code with hashed code stored in the database
    const validCode = await this.appHelper.isValidData(verificationCode, user.verificationCode);
    if (!validCode) throw new BadRequestException(ErrorResponseMessages.INVALID_CODE);

    // user password to hashed password
    user.password = await this.appHelper.hashData(password);
    user.verificationCode = "";
    await user.save();

    return { message: SuccessResponseMessages.SUCCESS_GENERAL };
  }

  /** For both forgot password and email verification, sends email*/
  async resendVerificationCode(userId: string): Promise<ApiMessage> {
    const user = await this.userService.getUser({ userId });

    const randomCode = this.appHelper.generateAlphaNumeric(8);
    user.verificationCode = await this.appHelper.hashData(randomCode);
    await user.save();

    this.mailHelper.sendEmail(user.email, MailResponseMessages.RESEND_VERIFICATION_CODE, MailResponseMessages.RESEND_VERIFICATION_TEXT, randomCode, "");

    return { message: SuccessResponseMessages.VERIFICATION_CODE_SENT };
  }
}
