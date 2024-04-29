import React from "react";

import MeUser from "@/assets/chat/me-user.svg";

interface MyComponentProps {
  message: any;
}

const UserChat: React.FC<MyComponentProps> = ({ message }) => {
  return (
    <div className="flex items-start justify-end text-normal">
      <div
        className="border-radius-lg bg-gray-200 py-[12px] px-[16px]"
        style={{ maxWidth: "calc(100% - 102px)" }}
      >
        {message?.question}
      </div>
      <img src={MeUser} width={44} height={44} className="ml-[8px] bg"></img>
    </div>
  );
};

export default UserChat;
