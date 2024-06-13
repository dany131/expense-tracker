import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber, Length, Max, Min } from "class-validator";
import { Trim } from "@decorators/trim.decorator";
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

  /** Source of income
   * @example 6669e1e844bb78471c155c6a*/
  @IsMongoId()
  source: string;

  /** Date of income, YYYY-MM-DD
   * @example 2023-12-23*/
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