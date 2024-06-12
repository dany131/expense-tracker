import { IsEnum, Length } from "class-validator";
import { Trim } from "@decorators/trim.decorator";
import { IncomeCategory } from "@types";


export class CreateSourceDto {

  /**
   * Name of source
   * @example My source 12
   */
  @Trim()
  @Length(0, 300)
  name: string;

  /** Source type
   * @enum IncomeCategory*/
  @IsEnum(IncomeCategory)
  sourceType: IncomeCategory;

  /**
   * Description of source
   * @example My source 1234
   */
  @Trim()
  @Length(0, 3000)
  description: string;

}