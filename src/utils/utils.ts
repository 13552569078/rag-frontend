import { message } from "antd";

export const formatFileSize = (sizeInBytes: number) => {
  if (sizeInBytes < 0) {
    return "未知";
  } else if (sizeInBytes < 1024) {
    return `${sizeInBytes}B`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(2)}KB`;
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)}MB`;
  }
  return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)}G`;
};

export const formatDate = (timestamp: string, symbol = "-") => {
  if (timestamp) {
    const year = timestamp.slice(0, 4);
    const month = timestamp.slice(4, 6);
    const day = timestamp.slice(6, 8);
    // const hour = timestamp.slice(8, 10);
    // const minute = timestamp.slice(10, 12);
    return `${year}.${month}.${day}`;
    // return `${`${`${
    //   year + symbol + month + symbol + day
    // } ${hour}`}:${minute}`}`;
  }
  return "";
};

export const parseStatus = (status: string) => {
  let str = "解析失败";
  switch (status) {
    case "gray":
      str = "解析中";
      break;
    case "green":
      str = "解析成功";
      break;
    default:
      break;
  }
  return str;
};

export const fileDownload = (url: string, fileName: string) => {
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      // 下载文件的名称及文件类型后缀
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      // 在资源下载完成后 清除 占用的缓存资源
      window.URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    });
};
/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise，成功时resolve，失败时reject
 */
export async function copyToClipboard(text: string): Promise<void> {
  await copyToClipboardText(text);
  message.success("复制成功");
}

function copyToClipboardText(text: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // 创建一个临时的 textarea 元素
    const textarea = document.createElement("textarea");

    // 设置 textarea 的内容为要复制的文本
    textarea.value = text;

    // 将 textarea 添加到文档中（但不显示它）
    document.body.appendChild(textarea);

    // 选中 textarea 的内容
    textarea.select();

    try {
      // 执行复制命令
      const successful = document.execCommand("copy");
      resolve(successful);
    } catch (err) {
      message.error("复制失败");
      reject(err);
    } finally {
      // 移除临时的 textarea 元素
      document.body.removeChild(textarea);
    }
  });
}

// 延时
export function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

// 判定是否在区域
export function isCoordinateInsideRect(
  topLeft: number[],
  bottomRight: number[],
  point: number[],
  rate: number
): boolean {
  // 提取边界坐标的x和y值 换算比例
  const topLeftX = topLeft[0] * rate;
  const topLeftY = topLeft[1] * rate;
  const bottomRightX = bottomRight[0] * rate;
  const bottomRightY = bottomRight[1] * rate;

  // 提取要检查的坐标的x和y值
  const pointX = point[0];
  const pointY = point[1];
  // 检查点是否在矩形内部
  // 点必须在所有四个边界的范围内
  return (
    pointX >= topLeftX &&
    pointX <= bottomRightX && // x值在左右边界之间
    pointY >= topLeftY &&
    pointY <= bottomRightY // y值在上下边界之间
  );
}

export const trimExceptNewlines = (str: string) => {
  // 使用正则表达式替换字符串开头和结尾的除了换行符以外的空白字符
  return str.replace(/^\s*|\s*$/g, (match) => {
    // 如果匹配到的是换行符，则保留它；否则替换为空字符串
    return /\n/.test(match) ? match : "";
  });
};

export const convertNumber = (number: number) => {
  if (number >= 1000000000) {
    return `${(number / 1000000000).toFixed(2)}亿`;
  } else if (number >= 10000) {
    return `${(number / 10000).toFixed(2)}万`;
  } else if (number >= 1000) {
    return `${(number / 1000).toFixed(2)}千`;
  }
  return number.toString();
};
