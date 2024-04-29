import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { useImmer } from "use-immer";

import { apiApplicationDetail, apiApplicationEdit } from "@/api";
import Back from "@/components/back";
import { useQueryParams } from "@/hook";
import type { IApplicationCreate } from "@/types";

import Chat from "./chat";
import AppForm from "./form";

const AppChat: React.FC = () => {
  const paramsQuery = useQueryParams();

  const [detail, setDetail] = useImmer<IApplicationCreate>({
    application_id: "",
    application_description: "",
    application_name: "",
    application_prompt: "",
    h5_link: "",
    kb_ids: [],
    llm_model_name: "",
    timestamp: "",
  });

  // 获取应用详情
  const { refetch: detailRefetch } = useQuery({
    queryKey: ["appDetail"], // searchName 后期增加后端接口查询
    queryFn: async () => {
      const data = await apiApplicationDetail({
        application_id: paramsQuery.appkey || "",
      });
      setDetail(() => data);
      return data;
    },
  });

  const iframelink = `${defaultSettings.appFrontBase}ApplicationChatIframe/?appkey=${paramsQuery.appkey}`;

  // 编辑重新获取数据 下传
  const { mutate: editAppmutate } = useMutation({
    mutationFn: apiApplicationEdit,
    onSuccess: () => {
      detailRefetch();
    },
  });

  return (
    <div className="w-full h-full grid grid-cols-5">
      {detail.application_id && (
        <>
          <div className="col-span-2 border-[#E4E9ED] border-r-[1px] border-solid flex flex-col h-full overflow-y-hidden">
            <div className="py-[20px] px-[30px] bg-[#F9FAFE]">
              <Back type={1} bread={detail?.application_name} />
            </div>
            <div className="py-[20px] px-[40px] bg-white flex-1 overflow-y-auto">
              <AppForm
                detail={detail}
                iframelink={iframelink}
                editFrom={(value) =>
                  editAppmutate({
                    ...value,
                    application_id: detail?.application_id,
                  })
                }
              />
            </div>
          </div>
          <div className="col-span-3 h-full overflow-y-hidden flex">
            <Chat detail={detail} />
          </div>
        </>
      )}
    </div>
  );
};

export default AppChat;
