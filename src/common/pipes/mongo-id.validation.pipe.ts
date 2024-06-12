import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { ErrorResponseMessages } from "@messages/index";


@Injectable()
export class ValidateMongoId implements PipeTransform<string> {
  transform(value: string): string { // Optional casting into ObjectId if wanted!
    if (ObjectId.isValid(value)) {
      if ((String)(new ObjectId(value)) === value)
        return value;
      throw new BadRequestException(ErrorResponseMessages.MONGO_ID);
    }
    throw new BadRequestException(ErrorResponseMessages.MONGO_ID);
  };
}