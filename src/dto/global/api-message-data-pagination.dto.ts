import { ApiMessageDataDto } from "./api-message-data.dto";


export class ApiMessageDataPaginationDto<T> extends ApiMessageDataDto<T> {
  /**
   * Page number requested
   * @example 10
   */
  page: number;

  /**
   * Last page for the data
   * @example 10
   */
  lastPage: number;

  /**
   * Total number of objects
   * @example 10
   */
  total: number;
}