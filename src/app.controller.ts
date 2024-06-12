import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { Public } from "./common/decorators";


@ApiTags("app")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Public()
  @Get("health-check")
  healthCheck(): string {
    return this.appService.healthCheck();
  }
}
