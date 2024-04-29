import { createBrowserRouter } from "react-router-dom";

import Layout from "@/layout";
import Application from "@/pages/application";
import ApplicationChat from "@/pages/application/chat";
import ApplicationDocs from "@/pages/application/chat/apidocs";
import ApplicationChatIframe from "@/pages/application/chat/chat";
import KnowlegeBase from "@/pages/knowlege-base";
import KnowlegeBaseDetail from "@/pages/knowlege-base/base/deatail";
import knowlegeBaseFileChat from "@/pages/knowlege-base/chat/filechat-index";
import knowlegeBaseChat from "@/pages/knowlege-base/chat/index";
import KnowlegeBaseChunk from "@/pages/knowlege-base/chunk/index";
import knowlegeBaseFilePreview from "@/pages/knowlege-base/preview/index";
import Login from "@/pages/login";
import NoMatch from "@/pages/no-match";

const router = createBrowserRouter(
  [
    { path: "*", Component: NoMatch },
    // 增加登录页面
    { path: "login", Component: Login },
    { path: "ApplicationChatIframe", Component: ApplicationChatIframe },
    { path: "ApplicationDocs", Component: ApplicationDocs },
    {
      Component: Layout,
      children: [
        // 重定向
        { index: true, Component: Login },
        // 知识库列表
        {
          path: "knowlegeBase",
          Component: KnowlegeBase,
        },
        // 知识库文件列表
        {
          path: "knowlegeBaseDetail",
          Component: KnowlegeBaseDetail,
        },
        // chunk列表
        {
          path: "knowlegeBaseChunk",
          Component: KnowlegeBaseChunk,
        },
        // 知识库问答
        {
          path: "knowlegeBaseChat",
          Component: knowlegeBaseChat,
        },
        // 文档问答
        {
          path: "knowlegeBaseFileChat",
          Component: knowlegeBaseFileChat,
        },
        // 文档预览
        {
          path: "knowlegeBaseFilePreview",
          Component: knowlegeBaseFilePreview,
        },
        // 智能应用
        {
          path: "Application",
          Component: Application,
        },
        // 智能应用聊天
        {
          path: "ApplicationChat",
          Component: ApplicationChat,
        },
      ],
    },
  ]
  // {
  //   basename: "/rag", // 设置基路径为 /rag
  // }
);
export default router;
