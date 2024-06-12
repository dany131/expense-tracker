import * as bcrypt from "bcrypt";
import { Injectable } from "@nestjs/common";


@Injectable()
export class AppHelper {
  constructor() {
  }

  /** Hash any data */
  public hashData(data: string, saltRounds: number = 10): Promise<string> {

    return bcrypt.hash(data, saltRounds);
  }

  /** Compare data with hash*/
  public async isValidData(data: string, compareWith: string): Promise<boolean> {

    return await bcrypt.compare(data, compareWith);
  }

  /** Generates alphanumeric string of provided length*/
  public generateAlphaNumeric(length: number): string {
    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  public escapeRegex(text: string): string {

    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

}

