import { Matches } from "class-validator";
import { Trim } from "@decorators/trim.decorator";
import { RegexConstants } from "@constants/regex.constants";
import { ErrorResponseMessages } from "@messages/error-response.messages";


export class ChangePasswordDto {

  /**
   * Old password of the user
   * @example Abcd@123
   */
  @Trim()
  @Matches(RegexConstants.PASSWORD, { message: ErrorResponseMessages.PASSWORD_FORMAT })
  oldPassword: string;

  /**
   * New password of the user
   * @example Abcd@123
   */
  @Trim()
  @Matches(RegexConstants.PASSWORD, { message: ErrorResponseMessages.PASSWORD_FORMAT })
  newPassword: string;

}

