import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  // base: "/rag",
  // 配置别名
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // 配置代理
  server: {
    host: "0.0.0.0",
    port: 5001,
    open: true,
    proxy: {
      // "/api": {
      //   target: "https://agents.dragoncity.site",
      //   changeOrigin: true,
      //   secure: false,
      //   // rewrite: path => path.replace(/^\/api/, ''),
      // },
      "/api": {
        // target: "http://10.56.183.56:8777/", // 刘帅56
        // target: "http://10.56.180.55:8777", // 肖峰本地
        target: "http://10.56.180.64:8777", // 刘帅本地
        // target: "http://10.56.180.115:8777", // 孙伟本地
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/ragapi/": {
        // http://8.130.16.234/ 会默认带着参数 转为http://8.130.16.234/ragapi
        // ngnix 代理了/ragapi
        target: "http://8.130.16.234/", // 线上地址
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/ragapi/, ""),
      },
      // "/cestc-xingzhi-bucket": {
      //   target: "http://10.56.183.56:9000", // 刘帅本地
      //   changeOrigin: true,
      //   secure: false,
      //   // rewrite: (path) => path.replace(/^\/api/, ""),
      // },
    },
    cors: true,
  },
});
