/** @type {import('tailwindcss').Config} */
import { addDynamicIconSelectors } from "@zhangwj0520/tailwind-iconify-plugin";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        title: "#202020",
        secondTitle: "#8A8A8A",
        normal: "#4b4b4b",
        light: "#dddddd",
        active: "#2C54D1",
        disabled: "#aaaaaa",
      },
      fontSize: {
        20: "20px",
        18: "18px",
        16: "16px",
        14: "14px",
      },
    },
  },
  plugins: [
    addDynamicIconSelectors({
      iconSets: {
        base: { path: "src/assets/knowlege-base" },
        chat: { path: "src/assets/chat" },
        app: { path: "src/assets/app" },
      },
    }),
    addDynamicIconSelectors({
      prefix: "icon-hover",
      overrideOnly: true,
      iconSets: {
        base: { path: "src/assets/knowlege-base" },
        chat: { path: "src/assets/chat" },
        app: { path: "src/assets/app" },
      },
    }),
  ],
  corePlugins: {
    preflight: false,
  },
};
