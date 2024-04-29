import { Popover, Timeline } from "antd";
import { JsonView } from "react-json-view-lite";

import { useQueryParams } from "@/hook";
import { copyToClipboard } from "@/utils";

const headers = {
  "Content-Type": "application/json",
  Accept: ["text/event-stream", "application/json"],
  Authorization: "token 必填 请联系管理员获取",
};

const AppLink: React.FC = () => {
  const paramsQuery = useQueryParams();

  const docsLink = `${defaultSettings.appFrontBase}ApplicationDocs`;

  const iframelink = `${defaultSettings.appFrontBase}ApplicationChatIframe?appkey=${paramsQuery.appkey}`;

  // 外链打开
  const openH5Link = () => {
    window.open(iframelink, "_blank");
  };

  // 外链打开
  const openDocsLink = () => {
    window.open(docsLink, "_blank");
  };

  return (
    <>
      <div className="bg-[#F9FAFE] pb-[28px] pt-[40px] px-[40px] mt-[20px]">
        <Timeline
          items={[
            {
              color: "#2C54D1",
              children: (
                <>
                  <div className="flex justify-between text-white items-center">
                    <div className="flex items-center">
                      <div className="icon-[app--arrow-left1] text-[30px]"></div>
                      <div className="bg-[#2C54D1] py-[4px] pr-[10px]">
                        PC端/iframe一键集成
                      </div>
                    </div>
                    <span
                      className="cursor-pointer text-active"
                      onClick={openH5Link}
                    >
                      打开
                    </span>
                  </div>
                  <div className="text-secondTitle text-14 mt-[12px]">
                    使用以下链接，以iFrame嵌入形势直接将右侧ChatBot集成到任何应用中，ChatBot为自适应设计，可以使用height\widths属性根据您需求规定大小，界面将自适应
                  </div>
                  <div className="text-14 mt-[12px] text-secondTitle">
                    链接地址
                  </div>
                  <div className="flex text-14 mt-[12px] px-[10px] py-[10px] bg-white text-active items-center">
                    <span className="flex-1 truncate">{iframelink}</span>
                    <Popover content="复制" title={null}>
                      <div
                        className="icon-[app--copy] text-[18px] ml-2 cursor-pointer"
                        onClick={() => copyToClipboard(iframelink)}
                      ></div>
                    </Popover>
                  </div>
                </>
              ),
            },
            {
              color: "#2C54D1",
              children: (
                <>
                  <div className="flex justify-between text-white items-center">
                    <div className="flex items-center">
                      <div className="icon-[app--arrow-left1] text-[30px]"></div>
                      <div className="bg-[#2C54D1] py-[4px] pr-[10px]">
                        API集成
                      </div>
                    </div>
                    <span className="cursor-pointer text-secondTitle">
                      集成说明
                    </span>
                  </div>
                  <div className="text-secondTitle text-14 mt-[12px]">
                    使用以下api接口地址，快速api集成ChatBot
                  </div>
                  <div className="text-secondTitle text-14 mt-[12px]">
                    自定义请求header
                  </div>
                  <div className="flex text-14 mt-[12px] px-[10px] py-[10px] bg-white items-center json-container relative">
                    <JsonView data={headers}></JsonView>
                  </div>
                  <div className="text-secondTitle text-14 mt-[12px]">
                    传参说明
                  </div>
                  <div className="flex text-14 mt-[12px] px-[10px] py-[10px] bg-white items-center json-container relative">
                    <JsonView data={defaultSettings.appChatParams}></JsonView>
                    <Popover content="复制" title={null}>
                      <div
                        className="icon-[app--copy] text-[18px] ml-2 cursor-pointer absolute right-[10px] bottom-[10px]"
                        onClick={() =>
                          copyToClipboard(
                            JSON.stringify(defaultSettings.appChatParams)
                          )
                        }
                      ></div>
                    </Popover>
                  </div>
                  <div className="text-secondTitle text-14 mt-[12px] flex justify-between">
                    <span>接口地址</span>

                    <span
                      className="cursor-pointer text-active"
                      onClick={openDocsLink}
                    >
                      打开文档
                    </span>
                  </div>
                  <div className="flex text-14 mt-[12px] px-[10px] py-[10px] bg-white text-active items-center">
                    <span className="flex-1 truncate">
                      {defaultSettings.appBackChatUrl}
                    </span>
                    <Popover content="复制" title={null}>
                      <div
                        className="icon-[app--copy] text-[18px] ml-2 cursor-pointer"
                        onClick={() =>
                          copyToClipboard(defaultSettings.appBackChatUrl)
                        }
                      ></div>
                    </Popover>
                  </div>
                </>
              ),
            },
          ]}
        />
      </div>
    </>
  );
};

export default AppLink;
