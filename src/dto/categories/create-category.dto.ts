import { IsEnum, Length } from "class-validator";
import { Trim } from "@decorators/trim.decorator";
import { ExpenseCategory } from "@types";


export class CreateCategoryDto {

  /**
   * Name of category
   * @example My Category 12
   */
  @Trim()
  @Length(0, 300)
  name: string;

  /** Category type
   * @enum ExpenseCategory*/
  @IsEnum(ExpenseCategory)
  categoryType: ExpenseCategory;

  /**
   * Description of category
   * @example My category 1234
   */
  @Trim()
  @Length(0, 3000)
  description: string;

}