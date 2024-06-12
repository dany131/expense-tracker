import { IsEmail, Length, Matches } from "class-validator";
import { Trim } from "@decorators/trim.decorator";
import { RegexConstants } from "@constants/regex.constants";
import { ErrorResponseMessages } from "@messages/error-response.messages";


export class CreateAdminDto {

  /**
   * Name of the user
   * @example Useruser
   */
  @Trim()
  @Matches(RegexConstants.ONLY_LETTERS_SPACES, { message: ErrorResponseMessages.USER_NAME })
  @Length(2, 50)
  name: string;

  /**
   * Email of the user
   * @example johndoe@gmail.com
   */
  @IsEmail()
  email: string;

  /**
   * Password of the user
   * @example Abcd@123
   */
  @Trim()
  @Matches(RegexConstants.PASSWORD, { message: ErrorResponseMessages.PASSWORD_FORMAT })
  password: string;
}