import { Switch } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

import FileIcon from "@/components/file-icon";

interface Iback {
  bread: string;
  type?: number;
  showSitch?: boolean;
  openPreview?: boolean;
  changePreview?: (value: boolean) => void;
}

const Back: React.FC<Iback> = ({
  bread = "",
  type = 1,
  showSitch = true,
  openPreview = true,
  changePreview,
}) => {
  const navigate = useNavigate();

  const onChange = (checked: boolean) => {
    changePreview!(checked);
  };

  // type = 1 文档库返回  2 知识库返回  3文件会话返回
  return (
    <div className="items-center flex">
      <div
        className="cursor-pointer items-center flex"
        onClick={() => navigate(-1)}
      >
        {/* <img src={arrowLeftIcon} alt="icon"></img> */}
        <span className="icon-[base--arrow-left] mr-2 text-18"></span>
        <span className="font-bold text-title ml-[4px] text-16">返回</span>

        <div className="w-[1px] bg-[#E4E9ED] h-[16px] ml-[20px]"></div>
      </div>
      {type === 1 && (
        <div className="text-ellipsis ml-4 text-title font-bold text-[14px]">
          {bread}
        </div>
      )}
      {type === 2 && (
        <div className="items-center flex overflow-x-hidden ml-4 flex-1 felx min-w-[0]">
          {/* <img src={Total}></img> */}
          <span className="icon-[base--total] mr-2 text-16"></span>
          <div
            className="ml-2 text-ellipsis text-normal text-[14px] flex-1 overflow-hidden whitespace-nowrap"
            title={bread}
          >
            {bread}
          </div>
        </div>
      )}
      {type === 3 && (
        <div className="items-center flex overflow-x-hidden ml-4 flex-1 justify-between min-w-[0]">
          <div
            className="ml-2 flex items-center text-16 min-w-[0] felx-1"
            title={bread}
          >
            <FileIcon name={bread}></FileIcon>
            <div className="ml-2 text-normal text-ellipsis overflow-hidden whitespace-nowrap flex-1 text-[14px]">
              {bread}
            </div>
          </div>
          {showSitch && (
            <div className="flex items-center">
              <span className="mr-2">
                {/* {openPreview ? "开启色块" : "关闭色块"} */}
                色块开关
              </span>
              <Switch defaultChecked={openPreview} onChange={onChange} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Back;
