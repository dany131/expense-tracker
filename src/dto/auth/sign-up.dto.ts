import { IsEmail, Length, Matches } from "class-validator";
import { RegexConstants } from "@constants/index";
import { ErrorResponseMessages } from "@messages/error-response.messages";
import { Trim } from "@decorators/index";


export class SignUpDto {

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