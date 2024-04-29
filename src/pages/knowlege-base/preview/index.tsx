import React, { useState } from "react";

import Back from "@/components/back";
import { useQueryParams } from "@/hook";

import Preview from "./preview";

const KnowlegeBaseFilePreview: React.FC = () => {
  // 使用useParams获取路由参数
  const paramsQuery = useQueryParams();

  const [openPreview, setOpenPreview] = useState(true);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="py-[20px] px-[30px] bg-[#F9FAFE]">
        <Back
          type={3}
          bread={`${paramsQuery?.filename}`}
          openPreview={openPreview}
          changePreview={(value) => setOpenPreview(value)}
        />
      </div>
      <div className="flex flex-col overflow-y-hidden items-center">
        <div style={{ width: "50%" }} className="overflow-y-auto">
          <Preview openPreview={openPreview} />
        </div>
      </div>
    </div>
  );
};

export default KnowlegeBaseFilePreview;
