export interface IKnowledgeItem {
  kb_id: string;
  kb_name: string;
  createTime?: string;
  edit?: boolean;
}

export interface IDataSourceItem {
  dataSource?: string; // 数据来源
  detailDataSource?: string; // 详细来源信息
  file_name: string | null; // 文件名
  content: string | null; // 内容
  score: number | null; // 评分
  file_id: string | null;
  showDetailDataSource?: boolean; // 是否展示详细来源信息
}

export interface IChatItem {
  id: "";
  type: string; // 区别用户提问 和ai回复
  question: any; // 问题
  answer: string; // 问题 | 回复内容
  like: number; // 点赞
  unlike?: boolean; // 点踩
  copied?: boolean; // 点拷贝置为true 提示拷贝成功 然后置为false  重置原因:点击拷贝后添加颜色提示拷贝过了 1s后置为普通颜色

  showTools?: boolean; // 当期问答是否结束 结束展示复制等小工具和取消闪烁
  source?: Array<IDataSourceItem>;
}

// url解析状态（前端展示）
export type inputStatus =
  | "default"
  | "inputing"
  | "parsing"
  | "success"
  | "defeat"
  | "hover";

// url类型约束
export interface IUrlListItem {
  status: inputStatus;
  text: string;
  percent: number;
  borderRadius?: string;
}

// 上传文件
export interface IFileListItem {
  file?: File;
  file_name: string;
  status: string;
  file_id: string;
  percent?: number;
  errorText?: string;
}

// 知识库卡片

export interface IknowBase {
  kb_id: string;
  kb_name: string;
  timestamp: string;
  page_size: number;
  file_count: number;
}

// 知识库文件
export interface Iknowfile {
  file_id: string;
  file_name: string;
  status: string;
  bytes: number;
  content_length: number;
  timestamp: string;
  file_page: number;
  minio_url: string;
  msg: string;
  url: string;
  progress: string;
}

export interface ITotal {
  green: number;
  red: number;
  gray: number;
}

// 历史记录
export interface Ihistory {
  id: string;
  answer: string;
  question: string;
  type: string;
  like: boolean;
  checked: boolean;
}

// 文档摘要
export interface IdigestData {
  file_id: string;
  file_name: string;
  status: string;
  url?: string;
  file_digest: string;
}

// chunkList
export interface IchunkList {
  chunk_id: string;
  file_id: string;
  question: string;
  content: string;
  file_name: string;
}
