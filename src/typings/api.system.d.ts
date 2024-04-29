declare namespace Api {
  interface ResponseType {
    code: number;
    msg: string;
    data: any;
    [key: string]: any;
  }

  // type ListEntity<T = unknown> = Promise<{
  //   data: T[];
  //   total: number;
  //   success: boolean;
  // }>;
  type ListEntity<T = unknown> = {
    list: T[];
    total: number;
    success: boolean;
  };

  type DataEntity<T = unknown> = T;
  declare type PaginationType = {
    current?: number;
    pageSize?: number;
    total: number;
  };

  declare type PaginationQueryType = Omit<PaginationType, 'total'>;

  type DeleteIds = (string | number)[];
}

declare namespace ApiSystem {
  type AliToken = {
    token: string;
    expire_time: string;
  };

  type AliTokenResponse = ResponseType & {
    data: AliToken;
  };

  type AliTokenQuery = () => Promise<AliTokenResponse>;
}