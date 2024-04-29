import React from "react";

import enptyIcon from "@/assets/chat/empty.svg";

const Empty: React.FC = () => {
  return (
    <div className="flex justify-center items-center flex-col h-full">
      <div className="mt-[-15%]">
        <img src={enptyIcon} alt="Empty"></img>
        <p className="text-normal">
          来问我问题吧，我会把知识库对应内容展示给您～
        </p>
      </div>
    </div>
  );
};

export default Empty;
