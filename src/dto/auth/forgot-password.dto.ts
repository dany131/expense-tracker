import { IsEmail } from "class-validator";
import { StringLower } from "@decorators/string-lower.decorator";


export class ForgotPasswordDto {

  /**
   * Email of the user
   * @example johndoe@gmail.com
   */
  @IsEmail()
  @StringLower()
  email: string;

}