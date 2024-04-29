import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface Iinfo {
  id: string;
  name: string;
  token: string;
}

interface BearState {
  userInfo: Iinfo;
  setUserInfo: (data: Iinfo) => void;
}

export const useUserStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        userInfo: {
          id: "",
          name: "",
          token: "",
        },
        setUserInfo: (data: Iinfo) => set(() => ({ userInfo: data })),
      }),
      {
        name: "userInfo",
      }
    )
  )
);
