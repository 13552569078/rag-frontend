import React from "react";

import FileDoc from "@/assets/knowlege-base/FileDoc.svg";
import Filehtml from "@/assets/knowlege-base/Filehtml.svg";
import FilePdf from "@/assets/knowlege-base/FilePdf.svg";
import FilePpt from "@/assets/knowlege-base/FilePpt.svg";
import { isPdf, isPpt, isUrl, isWord } from "@/utils";

interface Icomponents {
  name: string;
  size?: string;
}

const FileIcon: React.FC<Icomponents> = ({ name = "", size = "" }) => {
  const getIcon = () => {
    if (isUrl(name)) return Filehtml;
    if (isWord(name)) return FileDoc;
    if (isPdf(name)) return FilePdf;
    if (isPpt(name)) return FilePpt;
    return FileDoc;
  };

  const iconUrl = getIcon(); // 调用函数获取图标 URL

  return (
    <img
      src={iconUrl}
      alt="fileicon"
      className={`${size === "large" && "w-[24px]"}`}
    />
  );
};

export default FileIcon;
