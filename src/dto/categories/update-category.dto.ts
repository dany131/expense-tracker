import { IsEnum, IsOptional, Length } from "class-validator";
import { Trim } from "@decorators/trim.decorator";
import { ExpenseCategory } from "@types";


export class UpdateCategoryDto {

  /**
   * Name of category
   * @example My Category 12
   */
  @IsOptional()
  @Trim()
  @Length(0, 300)
  name: string;

  /** Category type
   * @enum ExpenseCategory
   */
  @IsOptional()
  @IsEnum(ExpenseCategory)
  categoryType: ExpenseCategory;

  /**
   * Description of category
   * @example My category 1234
   */
  @IsOptional()
  @Trim()
  @Length(0, 3000)
  description: string;

}