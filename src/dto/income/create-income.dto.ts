import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, Length, Max, Min } from "class-validator";
import { Trim } from "@decorators/trim.decorator";
import { IncomeCategory } from "@types";
import { Transform, Type } from "class-transformer";
import { IsValidDate } from "@decorators/valid-date.decorator";


export class CreateIncomeDto {

  /** Amount of income
   * @example 100*/
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(9999999)
  amount: number;

  /** Category of income
   * @enum IncomeCategory*/
  @IsEnum(IncomeCategory)
  category: IncomeCategory;

  /** Date of income, DD/MM/YYYY
   * @example 23/12/2023*/
  @IsNotEmpty()
  @IsValidDate()
  date: string;

  /**
   * Description of income
   * @example Income from freelance
   */
  @Trim()
  @Length(0, 3000)
  description: string;

  /**
   * true/false or recurring income
   * @example true
   */
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => {
    return [true, "true"].indexOf(value) > -1;
  })
  isRecurring: boolean;

}