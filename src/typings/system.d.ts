/** 请求的相关类型 */
declare namespace Service {
  /**
   * 请求的错误类型：
   * - axios: axios错误：网络错误, 请求超时, 默认的兜底错误
   * - http: 请求成功，响应的http状态码非200的错误
   * - backend: 请求成功，响应的http状态码为200，由后端定义的业务错误
   */
  type RequestErrorType = 'axios' | 'http' | 'backend';

  /** 自定义的请求结果 */
  type RequestResult<T = any> = {
    /** 错误码 */
    code: number;
    /** 错误信息 */
    msg: string;
    /** 请求数据 */
    data: any;
  }





}

