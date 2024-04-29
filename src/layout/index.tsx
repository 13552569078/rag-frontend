import { useMount } from "ahooks";
import { Input, Layout, theme } from "antd";
import type { SearchProps } from "antd/es/input/Search";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import "./index.css";

import SearchIcon from "@/assets/knowlege-base/search.svg";
import logo from "@/assets/layout/logo.svg";
import userpng from "@/assets/layout/user.svg";
import { useBaseStore } from "@/store/useBase";
import { useUserStore } from "@/store/useUser";

const { Header, Content } = Layout;

const { Search } = Input;

const searchStyle = {
  width: 300,
  backgroundColor: "rgba(255, 255, 255, 0.1)", // 背景色
  border: "1px solid rgba(255, 255, 255, 0.1)", // 边框
  borderRadius: 0, // 边框圆角
  // 注意：内联样式无法直接修改 placeholder 的颜色
};

const App: React.FC = () => {
  const navigate = useNavigate();

  // 用户信息
  const { userInfo, setUserInfo } = useUserStore();

  // 获取当前的路由
  const location = useLocation();
  const currentRouteName = location.pathname.replace("/", "");

  // 在这里引入所需状态
  const { setSearchName } = useBaseStore();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onSearch: SearchProps["onSearch"] = (value, _e) => {
    setSearchName(value);
  };

  const handleClick = (key: string) => {
    setSearchName("");
    navigate(key);
  };

  const clearUserInfo = () => {
    setUserInfo({ id: "", name: "zp", token: "" });
    navigate("/login");
  };

  const suffix = <img src={SearchIcon} />;

  useMount(() => {
    // 处理登录
    if (!userInfo?.id) {
      navigate("/login");
    }
  });

  return (
    <Layout
      className="w-screen h-screen"
      style={{
        background: "#fff",
      }}
    >
      <Header
        className="flex justify-between items-center flex-row text-white"
        style={{
          height: "64px",
          padding: "0 24px",
        }}
      >
        <div className="left-wrap flex items-center flex-1">
          <img src={logo} alt="logo" />
          <div className="menu-wrap flex-1 flex flex-row ml-28 gap-10 cursor-pointer text-white">
            <div
              className={`${
                currentRouteName.includes("knowlegeBase") || !currentRouteName
                  ? "active-menu"
                  : ""
              } h-[64px]`}
              onClick={() => handleClick("knowlegeBase")}
            >
              <div className="flex items-center">
                <span>知识库管理</span>
              </div>
            </div>
            <div
              className={`${
                currentRouteName.includes("Application") ? "active-menu" : ""
              } h-[64px]`}
              onClick={() => handleClick("Application")}
            >
              <div className="flex items-center">
                <span>智能应用管理</span>
              </div>
            </div>
          </div>
        </div>
        <div className="right-wrap flex items-center">
          {/* 知识库 应用主页搜索 */}
          {(currentRouteName === "knowlegeBase" ||
            !currentRouteName ||
            currentRouteName === "Application") && (
            <Search
              key={currentRouteName}
              className="cec-inputSearch-home"
              placeholder="请输入关键字搜索"
              allowClear
              onSearch={onSearch}
              style={searchStyle}
              enterButton
              suffix={suffix}
            />
          )}
          <img
            src={userpng}
            alt="user"
            className="ml-10 cursor-pointer"
            onClick={clearUserInfo}
          />
        </div>
      </Header>
      <Content
        style={{
          margin: "0px 0px 0px",
          padding: "0px",
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          overflow: "auto",
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
};

export default App;
