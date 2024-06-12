import { Injectable, Logger, LoggerService } from "@nestjs/common";


@Injectable()
export class LogHelper implements LoggerService {
  private readonly logger: Logger;

  constructor(private readonly context?: string) {
    this.logger = new Logger(this.context);
  }

  /**
   * Info logger
   */
  log(message: any) {

    this.logger.log(message);
  }

  /**
   * Error logger
   */
  error(message: any) {

    this.logger.error(message);
  }

  /**
   * Warn logger
   */
  warn(message: any) {

    this.logger.warn(message);
  }

  /**
   * Debug logger
   */
  debug?(message: any) {

    this.logger.debug(message);
  }

  /**
   * Verbose logger
   */
  verbose?(message: any) {

    this.logger.verbose(message);
  }

}