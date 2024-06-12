import { IsEnum, IsOptional, Length } from "class-validator";
import { Trim } from "@decorators/trim.decorator";
import { IncomeCategory } from "@types";


export class UpdateSourceDto {

  /**
   * Name of source
   * @example My source 12
   */
  @IsOptional()
  @Trim()
  @Length(0, 300)
  name: string;

  /** Source type
   * @enum IncomeCategory*/
  @IsOptional()
  @IsEnum(IncomeCategory)
  sourceType: IncomeCategory;

  /**
   * Description of source
   * @example My source 1234
   */
  @IsOptional()
  @Trim()
  @Length(0, 3000)
  description: string;

}