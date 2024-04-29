import { post } from "@/request";
import type {
  ITotal,
  IchunkList,
  IdigestData,
  Ihistory,
  IknowBase,
  Iknowfile,
  IpreviewData,
} from "@/types";

/**
 * Retrieves a list of files based on the provided parameters.
 *
 * @param {ApiDocument.FileListParams} data - the parameters for filtering the file list
 * @return {Promise<ApiDocument.FileList>} a promise that resolves to the list of files
 */
// 删除
export const apiDelKnowledgeBase = (data: ApiDocument.Idel) =>
  post<ApiDocument.FileList>("/local_doc_qa/delete_knowledge_base", data);

// 编辑
export const apiGeteditKnowledgeBase = (data: ApiDocument.Irename) =>
  post<ApiDocument.FileList>("/local_doc_qa/rename_knowledge_base", data);

// 新增
export const apiAddKnowledgeBase = (data: ApiDocument.IaddBaseKnowParams) =>
  post<ApiDocument.FileList>("/local_doc_qa/new_knowledge_base", data);

// 列表
export const apiKnowledgeBaseList = (data: ApiDocument.IbaseKnowParams) =>
  post<IknowBase[]>("/local_doc_qa/list_knowledge_base", data);

// 空间详情
export const apiKnowledgeBaseDetail = (
  data: ApiDocument.IbaseKnowDetailParams
) => post<ApiDocument.baseDetail[]>("/local_doc_qa/get_knowledge_base", data);

// 知识库列表
export const apiFileListApi = (data: ApiDocument.FileListParams) =>
  post<{ details: Iknowfile[]; total: ITotal }>(
    "/local_doc_qa/list_files",
    data
  );

// 删除文件
export const apiDeleteFile = (data: ApiDocument.DelListParams) =>
  post<ApiDocument.FileList>("/local_doc_qa/delete_files", data);

// 上传文件接口地址 fetch上传
export const apiFileUploadUrl = `${defaultSettings.baseApi}/local_doc_qa/upload_files`;

// 知识库聊天接口
export const apiKnowChatUrl = `${defaultSettings.baseApi}/local_doc_qa/local_doc_chat`;

// 文档聊天接口
export const apiFileChatUrl = `${defaultSettings.baseApi}/local_file_qa/local_files_chat`;

// llm聊天接口
export const apiKnowLLmChatUrl = `${defaultSettings.baseApi}/local_llm_chat/chat`;

// 获取推荐问题
export const apiRecommendList = (data: ApiDocument.IsuggestParams) =>
  post<string[]>("/local_doc_qa/get_recommend_questions", data);

// 获取文档摘要
export const apiFileDiges = (data: ApiDocument.Idigest) =>
  post<IdigestData[]>("/local_doc_qa/get_file_digest", data);

// 文档预览
export const apiFilePreview = (data: ApiDocument.IPreview) =>
  post<IpreviewData>("/local_doc_qa/get_file_preview_data", data);

// 历史记录
export const apiHistory = (data: ApiDocument.IhistoryParams) =>
  post<Ihistory[]>("/local_doc_qa/list_chat_records", data);

// 获取最新的历史记录
export const apiHistoryLatestId = (data: ApiDocument.IhistoryParams) =>
  post<{ id: string }[]>("/local_doc_qa/get_chat_record_latest", data);

// 评价
export const apiRecord = (data: { record_id: string; like: number }) =>
  post<{ id: string }>("/local_doc_qa/comment_chat_record", data);

// 删除聊天记录
export const apiDelHistorys = (data: { record_ids: string[] }) =>
  post<{ id: string }>("/local_doc_qa/delete_chat_records", data);

// 上传URL
export const apiUploadurl = (data: { kb_id: string; url: string }) =>
  post<{ id: string }>("/local_doc_qa/upload_url", data);

// 校验文档重复
export const apiCheckFfilesExist = (data: {
  kb_id: string;
  file_names: string[];
}) => post<string[]>("/local_doc_qa/check_files_exist", data);

// chunk列表
export const apiChunkList = (data: ApiDocument.IChunkListParams) =>
  post<{ list: IchunkList[]; total: number }>("/chunks/list_chunk", data);

// chunk编辑
export const apiChunkUpdate = (data: ApiDocument.IChunkPpdateParams) =>
  post<null>("/chunks/update_chunk", data);

// chunk新增
export const apiChunkAdd = (data: ApiDocument.IChunkAddParams) =>
  post<null>("/chunks/add_chunk", data);

// chunk列表删除
export const apiChunkListDel = (data: ApiDocument.IChunkListDelParams) =>
  post<null>("/chunks/delete_chunk", data);
