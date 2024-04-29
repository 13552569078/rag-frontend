import { Popover } from "antd";
import React, { useEffect, useRef, useState } from "react";

import Aiuser from "@/assets/chat/ai-user.svg";
import TwoCopy2 from "@/assets/knowlege-base/TwoCopy-active.svg";
import TwoCopy from "@/assets/knowlege-base/TwoCopy-normal.svg";
import TwoGood2 from "@/assets/knowlege-base/TwoGood-2.svg";
import TwoGood from "@/assets/knowlege-base/TwoGood.svg";
import TwoUngood2 from "@/assets/knowlege-base/TwoUngood-2.svg";
import TwoUngood from "@/assets/knowlege-base/TwoUngood.svg";
import type { IChatItem } from "@/types";
import { copyToClipboard } from "@/utils";

interface MyComponentProps {
  message: IChatItem;
  handleLike: (key: string, id: string, value: number) => void;
  index: number;
}

const UserChat: React.FC<MyComponentProps> = ({ message, handleLike }) => {
  const elementRef1 = useRef<HTMLDivElement>(null);
  const elementRef2 = useRef<HTMLDivElement>(null);

  const [copySrc, setCopySrc] = useState(TwoCopy);
  const [upSrc, setUpSrc] = useState(TwoGood);
  const [downSrc, setDownSrc] = useState(TwoUngood);

  const [width, setWidth] = useState(0); // 初始化宽度为0

  // 计算宽度 重新计算复制操作宽度
  useEffect(() => {
    const handleResize = () => {
      if (elementRef1.current) {
        const newWidth = elementRef1.current.offsetWidth;
        setWidth(newWidth + 70); // 更新状态以触发重新渲染
      }
    };

    if (elementRef1.current) {
      handleResize(); // 初始设置宽度
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(elementRef1.current);

      // 清理函数，在组件卸载时断开观察
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []); // 仅在组件挂载时执行

  // 入职内容重新处理字符串
  const formartCopyToClipboard = (text: string) => {
    // 处理字符串
    // const startIndex = text.indexOf("</h4>") + 5;
    const reStr = text!.replaceAll("<br/>", "");
    copyToClipboard(reStr);
  };

  return (
    <div className="mb-8 text-normal" style={{ maxWidth: "calc(100% - 52px)" }}>
      <div className="flex items-start mt-[18px] justify-start">
        <img src={Aiuser} width={44} height={44} className="mr-[8px]"></img>
        <div className="border-radius-lg bg-white py-[12px] px-[16px]">
          <div
            dangerouslySetInnerHTML={{ __html: message?.answer }}
            ref={elementRef1}
            className="dangerouslySetInnerHTML"
          ></div>
        </div>
      </div>
      {/* 没有id不展示操作 */}
      <div
        className={`flex justify-end mt-[8px]  mb-[5px] ${
          !message.id ? "hidden" : null
        }`}
        ref={elementRef2}
        style={{ width: `${width}px` }}
      >
        <Popover content="复制内容" title={null}>
          <img
            src={copySrc}
            onMouseEnter={() => setCopySrc(TwoCopy2)}
            onMouseLeave={() => setCopySrc(TwoCopy)}
            className="ml-2 cursor-pointer"
            height={20}
            onClick={() => formartCopyToClipboard(message?.answer)}
          ></img>
        </Popover>
        {/* 默认状态 */}
        {message?.like === 0 && (
          <span>
            <img
              src={upSrc}
              className="ml-2 cursor-pointer"
              onMouseEnter={() => setUpSrc(TwoGood2)}
              onMouseLeave={() => setUpSrc(TwoGood)}
              onClick={() => handleLike("like", message.id, 1)}
            ></img>

            <img
              src={downSrc}
              onMouseEnter={() => setDownSrc(TwoUngood2)}
              onMouseLeave={() => setDownSrc(TwoUngood)}
              className="ml-2 cursor-pointer"
              onClick={() => handleLike("like", message.id, 2)}
            ></img>
          </span>
        )}
        {message?.like === 1 && (
          <span>
            <img
              src={TwoGood2}
              className="ml-2 cursor-pointer"
              onClick={() => handleLike("like", message.id, 0)}
            ></img>

            <img
              src={downSrc}
              onMouseEnter={() => setDownSrc(TwoUngood2)}
              onMouseLeave={() => setDownSrc(TwoUngood)}
              className="ml-2 cursor-pointer"
              onClick={() => handleLike("like", message.id, 2)}
            ></img>
          </span>
        )}
        {message?.like === 2 && (
          <span>
            <img
              src={upSrc}
              className="ml-2 cursor-pointer"
              onMouseEnter={() => setUpSrc(TwoGood2)}
              onMouseLeave={() => setUpSrc(TwoGood)}
              onClick={() => handleLike("like", message.id, 1)}
            ></img>
            <img
              src={TwoUngood2}
              className="ml-2 cursor-pointer"
              onClick={() => handleLike("like", message.id, 0)}
            ></img>
          </span>
        )}
      </div>
    </div>
  );
};

export default UserChat;
