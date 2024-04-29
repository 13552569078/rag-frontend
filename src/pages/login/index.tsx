import { useMount } from "ahooks";
import React from "react";
import { useNavigate } from "react-router-dom";

import { useUserStore } from "@/store/useUser";

import Token from "./Token";

const Login: React.FC = () => {
  // 用户信息
  const { setUserInfo, userInfo } = useUserStore();

  const navigate = useNavigate();
  // 新增token
  const onFinish = async (values: { token: string }) => {
    setUserInfo({ id: "zzp", name: "zzp", token: `Bearer ${values.token}` });
    navigate("/knowlegeBase");
  };

  useMount(() => {
    // 处理登录
    if (!userInfo?.id) {
      navigate("/login");
    } else {
      navigate("/knowlegeBase");
    }
  });

  return (
    <div>
      <Token onFinish={onFinish} />
    </div>
  );
};

export default Login;
