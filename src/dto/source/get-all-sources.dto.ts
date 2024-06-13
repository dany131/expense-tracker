import { IsOptional, IsString, Length } from "class-validator";
import { Trim } from "@decorators/trim.decorator";
import { ApiProperty } from "@nestjs/swagger";


export class GetAllSourcesDto {

  @ApiProperty({ required: false, description: "Search by name of any source" })
  @IsOptional()
  @IsString()
  @Trim()
  @Length(1, 1000)
  searchQuery: string;

}

