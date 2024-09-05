export interface BaseResponse<T = undefined> {
  statusCode: number;
  data: T;
}
