import { IsOptional, IsString, Length } from "class-validator";
import { Trim } from "@decorators/trim.decorator";


export class GetCategoriesDto {

  /**
   * Search by name of any category
   * @example My cat
   */
  @IsOptional()
  @IsString()
  @Trim()
  @Length(1, 1000)
  searchQuery: string;

}

