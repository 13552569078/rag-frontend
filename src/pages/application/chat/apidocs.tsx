import CodeBlock from "@/components/code";

const AppDoc: React.FC = () => {
  const codeInstall = `
  npm i @microsoft/fetch-event-source --save
  
  yarn add @microsoft/fetch-event-source --save

  pnpm i @microsoft/fetch-event-source --save
  `;

  const codeChat = `
  import { fetchEventSource } from "@microsoft/fetch-event-source";

  const apiAppChatUrl = '应用的chatapi路径';

  fetchEventSource(apiAppChatUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: ["text/event-stream", "application/json"],
      Authorization: 'token 必填 请联系管理员获取',
    },
    body: JSON.stringify({
      user_id: 'user_id', // 用户id
      application_id: 'appkey', // 应用key
      history: [], // 历史记录传递 二维数组 [[q,a],[q2,a2]]
      question: '中国的首都是哪里', // question
      streaming: true, // 流式输出
    }),
    onopen(e: any) {
      if (e.ok && e.headers.get("content-type") === "text/event-stream") {
        // 链接成功
      } else if (e.headers.get("content-type") === "application/json") {
        return e
          .json()
          .then((data: any) => {
            // 错误处理
          })
          .catch(() => {
            // 错误处理
          });
      }
    },
    onmessage(msg: { data: string }) {
      // 监听message返回，流式返回
      const res: any = JSON.parse(msg.data);
      if (res?.code === 200 && res?.response) {
        // res?.response  此处处理流式数据
        // 此处添加业务逻辑
      }
    },
    onclose() {
      // 关闭链接
    },
    onerror(err: any) {
      // 错误处理
    },
  });
  `;

  return (
    <div className="pt-[20px] px-[50px] bg-gray-100 pb-[10px] overflow-y-auto">
      <h3 className="text-title">安装</h3>
      <div className="flex text-14 mt-[12px]">
        <CodeBlock codeString={codeInstall}></CodeBlock>
      </div>
      <h3 className="text-title mt-[10px]">请求方式</h3>
      <div className="flex text-14 mt-[12px]">
        <CodeBlock codeString={"post"}></CodeBlock>
      </div>
      <h3 className="text-title mt-[10px]">快速开始</h3>
      <div className="flex text-14 mt-[12px]">
        <CodeBlock codeString={codeChat}></CodeBlock>
      </div>
    </div>
  );
};

export default AppDoc;
