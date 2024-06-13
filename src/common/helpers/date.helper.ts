import { Injectable } from "@nestjs/common";
import * as moment from "moment";
import { DateRange } from "@types";
import { AppConstants } from "@constants/app.constants";


@Injectable()
export class DateHelper {

  getDate(date: string): Date {
    return moment.utc(date, AppConstants.DATE_FORMAT).toDate();
  }

  getToday(): DateRange {
    const start = moment().utc().startOf("day").toDate();
    const end = moment().utc().endOf("day").toDate();
    return { start, end };
  }

  getThisWeek(): DateRange {
    const start = moment().utc().startOf("week").toDate();
    const end = moment().utc().endOf("week").toDate();
    return { start, end };
  }

  getThisMonth(): DateRange {
    const start = moment().utc().startOf("month").toDate();
    const end = moment().utc().endOf("month").toDate();
    return { start, end };
  }

  getThisYear(): DateRange {
    const start = moment().utc().startOf("year").toDate();
    const end = moment().utc().endOf("year").toDate();
    return { start, end };
  }

}

















