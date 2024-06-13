import { Injectable } from "@nestjs/common";
import * as moment from "moment";
import { DateRange } from "@types";


@Injectable()
export class DateHelper {

  getDate(date: string): Date {
    return moment(date).utc().toDate();
  }

  getToday(): DateRange {
    const start = moment().startOf("day").utc().toDate();
    const end = moment().endOf("day").utc().toDate();
    return { start, end };
  }

  getThisWeek(): DateRange {
    const start = moment().startOf("week").utc().toDate();
    const end = moment().endOf("week").utc().toDate();
    return { start, end };
  }

  getThisMonth(): DateRange {
    const start = moment().startOf("month").utc().toDate();
    const end = moment().endOf("month").utc().toDate();
    return { start, end };
  }

  getThisYear(): DateRange {
    const start = moment().startOf("year").utc().toDate();
    const end = moment().endOf("year").utc().toDate();
    return { start, end };
  }

}

















