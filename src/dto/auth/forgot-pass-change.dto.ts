import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { Trim } from "@decorators/trim.decorator";
import { RegexConstants } from "@constants/regex.constants";
import { ErrorResponseMessages } from "@messages/error-response.messages";
import { StringLower } from "@decorators/string-lower.decorator";


export class ForgotPassChangeDto {

  /**
   * Email of the user
   * @example johndoe@gmail.com
   */
  @IsEmail()
  @StringLower()
  email: string;

  /**
   * Verification code sent on the email address
   * @example 123456
   */
  @IsNotEmpty()
  @IsString()
  verificationCode: string;

  /**
   * Password of the user
   * @example Abcd@123
   */
  @Trim()
  @Matches(RegexConstants.PASSWORD, { message: ErrorResponseMessages.PASSWORD_FORMAT })
  password: string;
}