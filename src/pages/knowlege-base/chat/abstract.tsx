import { useMutation } from "@tanstack/react-query";
import { useMount } from "ahooks";
import React from "react";
import { useImmer } from "use-immer";

import { apiFileDiges } from "@/api";
import Aiuser from "@/assets/chat/ai-user.svg";
import FileIcon from "@/components/file-icon";
import { useQueryParams } from "@/hook";
import type { IdigestData } from "@/types";

const Abstract: React.FC = () => {
  const paramsQuery = useQueryParams();

  const searchParams = {
    kb_id: paramsQuery.kbid || "",
    file_ids: [paramsQuery.fileid || ""],
  };

  const [abstract, setAbstract] = useImmer<IdigestData>({
    file_id: "",
    file_name: "",
    status: "",
    file_digest: "",
  });

  const { mutate: abstractMutate } = useMutation({
    mutationFn: apiFileDiges,
    onSuccess: (e) => {
      setAbstract(() => e[0]);
    },
  });

  useMount(() => {
    abstractMutate(searchParams);
  });

  return (
    <div
      className="flex items-start my-[20px] text-normal"
      style={{ maxWidth: "calc(100% - 52px)" }}
    >
      <img src={Aiuser} width={44} height={44}></img>
      <div className="bg-white border-radius-lg inline-block min-w-[400px] p-[20px] ml-2">
        <div className="flex items-center py-[12px] px-[10px] bg-[#F9FAFE] border-radius-lg">
          <FileIcon name={abstract.url || abstract.file_name}></FileIcon>
          <div className="ml-2 flex-1 text-ellipsis">
            {abstract?.url || abstract?.file_name}
          </div>
        </div>
        {/* 内容区域 */}
        <div className="mt-4">
          <div className="mt-4 leading-relaxed text-[14px]">
            {abstract.file_digest}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Abstract;
