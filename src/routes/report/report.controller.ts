import { Controller, Get, HttpCode, HttpStatus, Query, Req, Res } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SuccessResponseMessages } from "@messages/index";
import { Request, Response } from "express";
import { ReportService } from "@routes/report/report.service";
import { GetSummaryDto } from "@dto/report";
import { ApiMessageDataDto } from "@dto/global";


@ApiTags("report")
@ApiBearerAuth("JWT-auth")
@Controller("report")
export class ReportController {
  constructor(private reportService: ReportService) {
  }

  @Get("summary")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ApiMessageDataDto })
  async getSummary(@Req() request: Request,
                   @Query() getSummaryDto: GetSummaryDto) {
    return await this.reportService.getSummary(request.user.id, getSummaryDto);
  }

  @Get("download")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: SuccessResponseMessages.SUCCESS_GENERAL })
  async downloadSummary(@Req() request: Request,
                        @Res() response: Response,
                        @Query() getSummaryDto: GetSummaryDto) {
    await this.reportService.downloadSummary(request.user.id, getSummaryDto, response);
  }

}