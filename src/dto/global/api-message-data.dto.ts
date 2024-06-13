import { ApiProperty } from "@nestjs/swagger";
import { ApiMessageDto } from "./api-message.dto";


export class ApiMessageDataDto<T> extends ApiMessageDto {
  @ApiProperty({
    example: { key: "value" },
    type: "object",
    additionalProperties: true
  })
  data: T;
}