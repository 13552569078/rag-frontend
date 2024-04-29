import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { App as AntdApp, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { RouterProvider } from "react-router-dom";

import { queryClient } from "@/utils";
import GlobalAntd from "@/utils/antd/global-antd.tsx";

import router from "./routes";

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        // cssVar: true, //CSS 变量模式
        hashed: false,
        token: {
          // colorPrimary: theme.primaryColor,
        },
      }}
    >
      <AntdApp>
        <GlobalAntd />
      </AntdApp>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
      </PersistQueryClientProvider>
    </ConfigProvider>
  );
}
export default App;
