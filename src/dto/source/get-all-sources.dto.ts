import { IsOptional, IsString, Length } from "class-validator";
import { Trim } from "@decorators/trim.decorator";


export class GetAllSourcesDto {

  /**
   * Search by name of any source
   * @example My source
   */
  @IsOptional()
  @IsString()
  @Trim()
  @Length(1, 1000)
  searchQuery: string;

}

