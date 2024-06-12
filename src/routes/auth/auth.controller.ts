import {
  Body,
  Controller,
  Get,
  HttpCode,
  Headers,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards
} from "@nestjs/common";
import { Public } from "@decorators/index";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ErrorResponseMessages, SuccessResponseMessages } from "@messages/index";
import { EmailVerificationDto, ForgotPassChangeDto, ForgotPasswordDto, LoginDto, SignUpDto } from "@dto/auth";
import { AuthService } from "@routes/auth/auth.service";
import { ValidateMongoId } from "@pipes/index";
import { RtGuard } from "@guards/index";
import { Request } from "express";


@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {
  }

  /** Sign Trades Person or Home-Owner */
  @Public()
  @Post("signup")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  @ApiResponse({
    status: 400,
    description: `${ErrorResponseMessages.EMAIL_EXISTS}, ${ErrorResponseMessages.INVALID_AUTHENTICATION}`
  })
  async signUp(@Body() reqBody: SignUpDto) {
    return await this.authService.signUp(reqBody);
  }

  /** Login */
  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  @ApiResponse({
    status: 400,
    description: `${ErrorResponseMessages.INVALID_EMAIL}, ${ErrorResponseMessages.INVALID_PASSWORD}, ${ErrorResponseMessages.INVALID_AUTHENTICATION}`
  })
  async login(@Body() reqBody: LoginDto) {
    return await this.authService.login(reqBody);
  }

  /** Email verification after sign up */
  @Public()
  @Post("email-verification")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.ACCOUNT_VERIFICATION })
  @ApiResponse({
    status: 400,
    description: `${ErrorResponseMessages.USER_NOT_EXISTS}, ${ErrorResponseMessages.ACCOUNT_VERIFIED}, ${ErrorResponseMessages.INVALID_CODE}`
  })
  async emailVerification(@Query("userId", ValidateMongoId) userId: string,
                          @Body() reqBody: EmailVerificationDto) {
    return await this.authService.emailVerification(userId, reqBody);
  }

  /** Forgot password, sends email*/
  @Public()
  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.VERIFICATION_CODE_SENT })
  @ApiResponse({ status: 400, description: ErrorResponseMessages.INVALID_EMAIL })
  async forgotPassword(@Body() reqBody: ForgotPasswordDto) {
    return await this.authService.forgotPassword(reqBody);
  }

  /** Change password after email received on forgot password*/
  @Public()
  @Post("forgot-password/change-password")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  @ApiResponse({
    status: 400,
    description: `${ErrorResponseMessages.INVALID_EMAIL}, ${ErrorResponseMessages.INVALID_CODE}`
  })
  async forgotPasswordChange(@Body() reqBody: ForgotPassChangeDto) {
    return await this.authService.forgotPasswordChange(reqBody);
  }

  /** Generate new access and refresh tokens*/
  @Public()
  @UseGuards(RtGuard)
  @ApiBearerAuth("JWT-auth")
  @Get("tokens")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  @ApiResponse({ status: 403, description: ErrorResponseMessages.ACCESS_DENIED })
  @ApiResponse({ status: 401, description: ErrorResponseMessages.INVALID_REFRESH_TOKEN })
  async refreshToken(@Req() request: Request,
                     @Headers("authorization") headerAuthorization: string) {
    const authRtToken: string = headerAuthorization.split(" ")[1];
    return await this.authService.refreshTokens(request.user.id, authRtToken);
  }

  /** Logout*/
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  @ApiResponse({ status: 400, description: ErrorResponseMessages.USER_NOT_EXISTS })
  async logout(@Req() request: Request) {
    return await this.authService.logout(request);
  }

  /** Resend user verification code for both forgot password and email verification, sends email*/
  @Public()
  @Get("resend-verification-code")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.VERIFICATION_CODE_SENT })
  @ApiResponse({
    status: 400,
    description: `${ErrorResponseMessages.USER_NOT_EXISTS}, ${ErrorResponseMessages.ACCOUNT_VERIFIED}`
  })
  async resendVerificationCode(@Query("userId", ValidateMongoId) userId: string) {
    return await this.authService.resendVerificationCode(userId);
  }

}
