import Model_type1 from "@/assets/chat/type1.svg";
import Model_type2 from "@/assets/chat/type2.svg";

// 文件上传类型限制 文档
// export const FILE_TYPE = ".doc, .docx, .pdf, .txt, .md, .markdown";
export const FILE_TYPE = ".doc, .docx, .pdf";

// 文件上传类型限制 PPT
export const FILE_TYPE_PPT = ".ppt, .pptx, .pdf";

// 上传表格数据
export const FILE_TYPE_CSV = ".csv";

// 文件大小限制
export const FILE_SIZE = 20; // 20MB

// 默认模型
export const DEFAULT_MODEL_TYPE = "KnowBase";
// 通用知识类型
export const MODEL_TYPE = [
  {
    name: "知识库",
    key: "KnowBase",
    icon: Model_type1,
    disabled: false,
  },
  { name: "通用知识", key: "LLM", icon: Model_type2, disabled: false },
  // { name: "搜索引擎检索", key: "search", icon: Model_type3, disabled: true },
];

export const getModelIcon = (key: string) => {
  return MODEL_TYPE.filter((item) => {
    return item.key === key;
  })[0]?.icon;
};

export const getModelName = (key: string) => {
  return MODEL_TYPE.filter((item) => {
    return item.key === key;
  })[0]?.name;
};
