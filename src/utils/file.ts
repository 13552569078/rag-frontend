import type { RcFile } from "antd/es/upload/interface";

export function getFileExtension(filename: string) {
  return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)?.[0] : undefined;
}

/**
 * 文件下载
 * @param content
 * @param filename
 */
export function downloadFile(content: BlobPart, filename: string) {
  const a = document.createElement("a");
  const blob = content instanceof Blob ? content : new Blob([content]);
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
