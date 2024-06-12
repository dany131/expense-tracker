import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class EmailVerificationDto {

  /**
   * Verification code sent on the email address
   * @example "123456"
   */
  @IsNotEmpty()
  @IsString()
  verificationCode: string;
}