import { IsEmail, Matches } from "class-validator";
import { Trim } from "@decorators/trim.decorator";
import { RegexConstants } from "@constants/regex.constants";
import { ErrorResponseMessages } from "@messages/error-response.messages";
import { StringLower } from "@decorators/string-lower.decorator";


export class LoginDto {

  /**
   * Email of the user
   * @example johndoe@gmail.com
   */
  @IsEmail()
  @StringLower()
  email: string;

  /**
   * Password of the user
   * @example Abcd@123
   */
  @Trim()
  @Matches(RegexConstants.PASSWORD, { message: ErrorResponseMessages.PASSWORD_FORMAT })
  password: string;

}