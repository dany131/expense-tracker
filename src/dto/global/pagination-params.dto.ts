import { IsNotEmpty, IsNumber, Min } from "class-validator";
import { Type } from "class-transformer";


export class PaginationParamsDto {

  /**
   * Page number to be requested
   * @example 10
   */
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @Min(1)
  page: number;

  /**
   * Number of items on a page
   * @example 20
   */
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @Min(1)
  limit: number;

}