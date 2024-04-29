import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 窗口焦点重新获取
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});
