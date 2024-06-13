import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber, Length, Max, Min } from "class-validator";
import { Trim } from "@decorators/trim.decorator";
import { Transform, Type } from "class-transformer";
import { IsValidDate } from "@decorators/valid-date.decorator";


export class CreateExpenseDto {

  /** Amount of expense
   * @example 100*/
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(9999999)
  amount: number;

  /** Category of expense
   * @example 6669e1e844bb78471c155c6a */
  @IsMongoId()
  category: string;

  /** Date of expense, DD/MM/YYYY
   * @example 23/12/2023*/
  @IsNotEmpty()
  @IsValidDate()
  date: string;

  /**
   * Description of expense
   * @example Expense for rent
   */
  @Trim()
  @Length(0, 3000)
  description: string;

  /**
   * true/false or recurring expense
   * @example true
   */
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => {
    return [true, "true"].indexOf(value) > -1;
  })
  isRecurring: boolean;

}