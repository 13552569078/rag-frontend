import { post } from "@/request";
import type { IApplicationCreate, IApplicationList, Ihistory } from "@/types";

// 智能应用

// 列表
export const apiApplicationList = () =>
  post<IApplicationList[]>("/application/list_application");

// 删除
export const apiApplicationDelete = (data: ApiApplication.IdelParams) =>
  post<null>("/application/delete_application", data);

// 新增
export const apiApplicationAdd = (data: ApiApplication.IaddParams) =>
  post<null>("/application/create_application", data);

// 编辑
export const apiApplicationEdit = (data: ApiApplication.IaddParams) =>
  post<null>("/application/update_application", data);

// 详情
export const apiApplicationDetail = (data: { application_id: string }) =>
  post<IApplicationCreate>("/application/get_application", data);

// 模型选择
export const apiLlmList = () =>
  post<{ model_name: string; model_name_cn: string }[]>("/list_llm_models");

// 智能应用推荐
export const apiAppRecommendList = (data: {
  application_id: string;
  count: number;
}) => post<string[]>("/get_application_recommend_questions", data);

// 智能应用历史记录
export const apiAppChatHistoryList = (data: { application_id: string }) =>
  post<Ihistory[]>("/local_doc_qa/get_application_chat_records", data);

// 获取最新的历史记录
export const apiAppHistoryLatestId = (data: any) =>
  post<{ id: string }[]>(
    "/local_doc_qa/get_application_chat_record_latest",
    data
  );

// 应用聊天接口
export const apiAppChatUrl = `${defaultSettings.baseApi}/local_application_chat`;
