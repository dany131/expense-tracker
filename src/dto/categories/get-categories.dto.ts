import { IsOptional, IsString, Length } from "class-validator";
import { Trim } from "@decorators/trim.decorator";
import { ApiProperty } from "@nestjs/swagger";


export class GetCategoriesDto {

  @ApiProperty({ required: false, description: "Search by name of any category" })
  @IsOptional()
  @IsString()
  @Trim()
  @Length(1, 1000)
  searchQuery: string;

}

