import { useQuery } from "@tanstack/react-query";
import React from "react";

import { apiAppRecommendList, apiRecommendList } from "@/api";
import Aiuser from "@/assets/chat/ai-user.svg";
import Repeat from "@/assets/chat/repeat.svg";
import { useQueryParams } from "@/hook";

interface MyComponentProps {
  send: (s: string) => void;
  source?: "app";
}

const Suggest: React.FC<MyComponentProps> = ({ send, source }) => {
  const paramsQuery = useQueryParams();

  const searchParams = {
    kb_ids: paramsQuery.kbid || "",
    count: 4,
  };

  // 根据fileid 判断是知识库问答 || 文件问答
  paramsQuery.fileid &&
    Object.assign(searchParams, { file_ids: paramsQuery.fileid || "" });

  // 获取列表文件及知识库 app来源接口不同
  const { data: suggest, refetch: listRefetch } = useQuery({
    queryKey: ["suggestlist"],
    queryFn: async () => {
      if (source === "app") {
        const data = await apiAppRecommendList({
          application_id: paramsQuery?.appkey || "",
          count: 4,
        });
        return data;
      }
      const data = await apiRecommendList(searchParams);
      return data;
    },
  });

  return (
    <div
      className="flex items-start mb-[20px] text-normal"
      style={{ maxWidth: "calc(100% - 52px)" }}
    >
      <img src={Aiuser} width={44} height={44}></img>
      <div className="bg-white border-radius-lg inline-block min-w-[400px] px-[16px] pb-[6px] pt-[12px] ml-2">
        <div className="flex justify-between">
          <h4>您可以试着问我：</h4>
          <div
            className="flex items-center cursor-pointer"
            onClick={() => listRefetch()}
          >
            <img src={Repeat} alt="Repeat"></img>
            <div className="ml-2 text-active">换一换</div>
          </div>
        </div>
        {/* 内容区域 */}
        <div className="mt-1">
          {suggest?.map((item, index) => {
            return (
              <div
                className="py-[3px] px-[4px] text-base cursor-pointer suggest"
                onClick={() => send(item)}
                key={index}
              >
                <span
                  className={`index font-bold text-[14px]
                ${index === 0 && "text-[#FF4D4F]"}
                ${index === 1 && "text-[#FA8B16]"}
                ${index === 2 && "text-[#FABD16]"}
                ${index === 3 && "text-[#4A72E5]"}
                `}
                >
                  {index + 1}
                </span>
                <span className="index ml-2 text-[14px] hover:text-active">
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Suggest;
