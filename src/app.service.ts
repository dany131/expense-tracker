import { Injectable } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";


@ApiTags("app")
@Injectable()
export class AppService {
  healthCheck(): string {
    return "Application Working!";
  }
}
