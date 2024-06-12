import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { fileMimetypeFilter } from "@filters/index";
import { getMetadataStorage } from "class-validator";


const IMAGE_MIME_TYPES: string[] = ["png", "jpg", "jpeg"];

interface SwaggerField {
  name: string;
  type: string;
}

interface FileField {
  name: string;
  maxCount: number;
  required: boolean;
}

// Define a generic interface for files object
export interface FileFields {
  [key: string]: Express.Multer.File[];
}

export function FileUpload<T>(fieldName: string = "file", required: boolean = false, dtoClass: new () => T, localOptions?: MulterOptions) {
  const { requiredFields: dtoRequiredFields, properties } = getDtoData(dtoClass);
  const requiredFields: string[] = (required) ? [fieldName, ...dtoRequiredFields] : dtoRequiredFields;

  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, localOptions)),
    ApiConsumes("multipart/form-data"),
    ApiBody({
      schema: {
        type: "object",
        required: requiredFields,
        properties: {
          [fieldName]: {
            type: "string",
            format: "binary"
          },
          ...properties
        }
      }
    })
  );
}

export function MultipleFilesUpload(fieldName: string = "files", maxCount: number, required: boolean = false, localOptions?: MulterOptions) {
  return applyDecorators(
    UseInterceptors(FilesInterceptor(fieldName, maxCount, localOptions)),
    ApiConsumes("multipart/form-data"),
    ApiBody({
      schema: {
        type: "object",
        properties: {
          files: {
            type: "array",
            items: {
              type: "string",
              format: "binary"
            }
          }
        }
      }
    })
  );
}

export function MultipleFieldsUpload<T>(fields: FileField[], dtoClass: new () => T, localOptions?: MulterOptions) {

  const { requiredFields: dtoRequiredFields, properties: dtoProperties } = getDtoData(dtoClass);

  // Required properties
  const requiredFields: string[] = fields.map((field) => {
    if (field.required) return field.name;
  });
  const combinedRequiredFields = [...requiredFields, ...dtoRequiredFields];

  // All properties
  const properties = fields.reduce((acc, field) => {
    acc[field.name] = {
      type: "array",
      items: {
        type: "string",
        format: "binary"
      }
    };
    return acc;
  }, {});

  return applyDecorators(
    UseInterceptors(FileFieldsInterceptor(fields, localOptions)),
    ApiConsumes("multipart/form-data"),
    ApiBody({
      schema: {
        type: "object",
        required: combinedRequiredFields,
        properties: { ...properties, ...dtoProperties }
      }
    })
  );
}

export function ImageUpload<T>(fileName: string = "image", required: boolean = false, dtoClass: new () => T) {
  return FileUpload(fileName, required, dtoClass, {
    fileFilter: fileMimetypeFilter(...IMAGE_MIME_TYPES)
  });
}

export function ImagesUpload(fieldName: string = "images", maxCount: number, required: boolean = false) {
  return MultipleFilesUpload(fieldName, maxCount, required, {
    fileFilter: fileMimetypeFilter(...IMAGE_MIME_TYPES)
  });
}

export function ImagesFieldUpload<T>(fields: FileField[], dtoClass: new () => T) {
  return MultipleFieldsUpload(fields, dtoClass, {
    fileFilter: fileMimetypeFilter(...IMAGE_MIME_TYPES)
  });
}

function getDtoData<T>(dtoClass: new () => T) {
  const requiredFields: string[] = [];
  const fields: SwaggerField[] = [];

  const metadataStorage = getMetadataStorage();
  const validationMetadata = metadataStorage.groupByPropertyName(metadataStorage.getTargetValidationMetadatas(dtoClass, "", false, false));

  for (const [key, value] of Object.entries(validationMetadata)) {
    const required = (!value.find((validation) => validation.type === "conditionalValidation" && !validation.name));
    if (required) requiredFields.push(key);
    fields.push({ name: key, type: "string" });
  }

  const properties: any = {};
  fields.forEach(field => {
    properties[field.name] = { type: field.type };
  });

  return { requiredFields, properties };
}

