import { registerDecorator } from "class-validator";
import * as moment from "moment/moment";
import { AppConstants } from "@constants/index";


export function IsValidDate(validationOptions?: { message?: string }) {
  return function(object: Object, propertyName: string) {
    const { message } = validationOptions || {};

    registerDecorator({
      name: "IsValidDate",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: message || `Invalid date format. Use ${AppConstants.DATE_FORMAT}`
      },
      validator: {
        validate(value: any) {
          return moment(value, AppConstants.DATE_FORMAT, true).isValid();
        }
      }
    });
  };
}

