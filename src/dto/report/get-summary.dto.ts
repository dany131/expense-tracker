import { IsEnum, IsOptional } from "class-validator";
import { TimeFrame } from "@types";


export class GetSummaryDto {

  /**
   * Filter results by time frame
   * @enum TimeFrame
   */
  @IsOptional()
  @IsEnum(TimeFrame)
  timeFrame: TimeFrame;

}

