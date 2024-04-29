import { create } from "zustand";

interface Ibase {
  searchName: string;
  setSearchName: (str: string) => void;
}

export const useBaseStore = create<Ibase>()((set) => ({
  // 知识库名称的搜索
  searchName: "",
  setSearchName: (str: string) => set(() => ({ searchName: str })),
}));
