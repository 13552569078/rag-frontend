import React from "react";

import Aiuser from "@/assets/chat/ai-user.svg";
import LoadIcon from "@/assets/chat/load.png";

const Loading: React.FC = () => {
  return (
    <div className="flex items-start mt-[18px] justify-start">
      <img src={Aiuser} width={44} height={44} className="mr-2"></img>
      <div className="border-radius-lg bg-white pt-[10px] pb-[6px] px-[10px]">
        <img src={LoadIcon} height={24}></img>
      </div>
    </div>
  );
};

export default Loading;
