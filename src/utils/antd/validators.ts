import { isEmail, isIdCard, isMobile } from "native-lodash";

export const validators = {
  isRequiredInput: { required: true, message: "请输入!" },
  isRequiredSelect: { required: true, message: "请选择!" },
  // 手机号校验
  isMobile: () => ({
    validator(_: unknown, value: unknown) {
      if (!value) {
        return Promise.resolve();
      } else if (!isMobile(value as string)) {
        return Promise.reject(new Error("手机号码格式错误!"));
      }
      return Promise.resolve();
    },
  }),
  // 邮箱校验
  isEmail: () => ({
    validator(_: unknown, value: unknown) {
      if (!value) {
        return Promise.resolve();
      } else if (!isEmail(value as string)) {
        return Promise.reject(new Error("请输入正确的邮箱!"));
      }
      return Promise.resolve();
    },
  }),
  // 身份证号校验
  isIdCard: () => ({
    validator(_: unknown, value: unknown) {
      if (!value) {
        return Promise.resolve();
      } else if (!isIdCard(value as string)) {
        return Promise.reject(new Error("请输入正确的身份证号!"));
      }
      return Promise.resolve();
    },
  }),
};
