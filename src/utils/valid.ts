export const isWord = (fileName: string): boolean => {
  // 获取文件的扩展名
  const extension = fileName.split(".").pop()?.toLowerCase();
  // 检查扩展名是否是word文档的常见扩展名
  return extension === "doc" || extension === "docx";
};

export const isPdf = (fileName: string): boolean => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return extension === "pdf";
};

// 业务需要 ppt可上传 pdf文件
export const isPpt = (fileName: string): boolean => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return extension === "ppt" || extension === "pptx";
};

// 判断是否是url
export const isUrl = (url: string): boolean => {
  return url.startsWith("http://") || url.startsWith("https://");
};

// 校验url
export const validateUrl = (_: any, value: string) => {
  if (!value) {
    return Promise.resolve();
  }
  try {
    const nurl = new URL(value);
    console.log(nurl);
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(new Error("请输入有效的网址链接!"));
  }
};

// 校验提示词输入
export const validateQuestion = (_: any, value: string) => {
  if (!value) {
    return Promise.resolve();
  }
  if (value.includes("{question}")) {
    return Promise.resolve();
  }
  return Promise.reject(new Error("需要包含{question}结构"));
};
