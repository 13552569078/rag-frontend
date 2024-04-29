import { theme } from "antd";
import { kebabCase } from "lodash";

const { getDesignToken } = theme;

const globalToken = getDesignToken();
// console.log('globalToken: ', globalToken);

const formatColor = (globalToken) => {
  const colorRegExp =
    /^(#([0-9|a-f|A-F]{3}){1,2}|[rR][gG][Bb](\((\s*(2[0-4]\d|25[0-5]|[01]?\d{1,2})\s*,){2}\s*(2[0-4]\d|25[0-5]|[01]?\d{1,2})\s*\)|[Aa]\((\s*(2[0-4]\d|25[0-5]|[01]?\d{1,2})\s*,){3}\s*([01]|0\.\d*[1-9]\d*)\s*\)))$/;

  const colorList = Object.entries(globalToken)
    .filter((item) => colorRegExp.test(item[1]))
    .map((item) => [
      `antd-${kebabCase(item[0]).replace(/color-/, "")}`,
      item[1],
    ]);
  return Object.fromEntries(colorList);
};
const colorObject = formatColor(globalToken);
// console.log('colorObject: ', colorObject);

export { colorObject };
