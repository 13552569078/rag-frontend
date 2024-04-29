import { successCode } from "@/constants";
import { downloadFile } from "@/utils";

import Request, { type RequestConfig } from "./server";
import { handleBusinessError, handleNetworkError } from "./tools";
import { white_api } from "./white";

const request = new Request<Service.RequestResult>({
  timeout: 300000, // 超时五分钟
  baseURL: defaultSettings.baseApi,
  // headers: {
  //   Authorization: "Bearer 60213cdbb3a340708081b4e89c5124e5", // 默认请求头信息
  // },
  withCredentials: false,
  // 取消重复请求
  cancelDuplicateRequest: false,
  interceptors: {
    requestInterceptor(config) {
      config.headers = config.headers || {};
      // config.headers.Authorization = token;
      // 增加token校验
      const isToken = localStorage.getItem("userInfo");
      const isWhite = white_api.includes(config.url as string);
      if (isWhite) {
        config.headers.Authorization = defaultSettings.token;
        config.data = { ...config.data, user_id: "zzp" };
      } else {
        config.headers.Authorization = isToken
          ? `${
              JSON.parse(localStorage.getItem("userInfo") as string)?.state
                ?.userInfo?.token
            }`
          : "";
        // 增加用户id
        config.data = {
          ...config.data,
          user_id: JSON.parse(localStorage.getItem("userInfo") as string)?.state
            ?.userInfo?.id,
        };
      }

      config.headers["Content-Type"] = "application/json;charset=UTF-8";
      return config;
    },
    responseInterceptor({ data, config }) {
      // 跳过拦截器
      if (config.skipIntercept) return Promise.resolve(data);

      if (successCode.includes(data.code)) {
        // 自动提示
        // handleShowTips(data, config);
        return Promise.resolve(data.data);
      }
      // 处理业务错误
      handleBusinessError(data);
      return Promise.reject(data);
    },
    responseInterceptorCatch(error) {
      handleNetworkError(error);
      return Promise.reject(error);
    },
  },
});
export default request;

export const get = request.get.bind(request);
export const post = request.post.bind(request);
export const put = request.put.bind(request);
export const patch = request.patch.bind(request);
export const del = request.delete.bind(request);

/**
 * 下载文件
 * @param fileName 文件名
 * @param url
 * @param data
 * @param config
 * @returns
 */
export const download = (
  fileName: string,
  url: string,
  data?: unknown,
  config?: RequestConfig
) => {
  return request
    .get<BlobPart>(url, data, {
      skipIntercept: true,
      skipShowTips: true,
      responseType: "blob",
      ...config,
    })
    .then((res) => downloadFile(res, fileName))
    .catch((err) => {
      console.log("文件下载失败：", err);
    });
};
