import { Injectable, PipeTransform, BadRequestException } from "@nestjs/common";
import { ErrorResponseMessages } from "@messages/index";


@Injectable()
export class ParseFile implements PipeTransform {

  transform(files: Express.Multer.File | Express.Multer.File[]): Express.Multer.File | Express.Multer.File[] {
    if (files === undefined || files === null) {
      throw new BadRequestException(ErrorResponseMessages.EMPTY_FILE);
    }
    if (Array.isArray(files) && files.length === 0) {
      throw new BadRequestException(ErrorResponseMessages.EMPTY_FILE);
    }
    return files;
  }
}
