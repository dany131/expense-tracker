import { IsEnum, IsOptional } from "class-validator";
import { TimeFrame } from "@types";
import { ApiProperty } from "@nestjs/swagger";


export class GetSummaryDto {

  @ApiProperty({ enum: TimeFrame, required: false, description: "Filter results by time frame" })
  @IsOptional()
  @IsEnum(TimeFrame)
  timeFrame: TimeFrame;

}

