import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Dropdown, Modal } from "antd";
import type { MenuProps } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiApplicationDelete, apiApplicationEdit } from "@/api";
import type { IApplicationCreate, IApplicationList } from "@/types";
import { formatDate,convertNumber } from "@/utils";

import AddApp from "./addModal";

interface MyComponentProps {
  key: number;
  detail: IApplicationList;
  onReload: () => void;
}

const items: MenuProps["items"] = [
  {
    key: "edit",
    label: "编辑",
  },
  {
    key: "del",
    label: "删除",
  },
];

const AppCard: React.FC<MyComponentProps> = ({ detail, onReload }) => {
  const [editModal, setEditModal] = useState(false);

  const navgite = useNavigate();

  // 应用会话
  const goChat = () => {
    navgite({
      pathname: "/ApplicationChat",
      search: `appkey=${detail.application_id}`,
    });
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setEditModal(false);
  };

  const onFinish = (name: IApplicationCreate, detail: IApplicationCreate) => {
    editAppmutate(Object.assign(detail, name));
  };

  // 编辑
  const { mutate: editAppmutate, isPending } = useMutation({
    mutationFn: apiApplicationEdit,
    onSuccess: () => {
      setEditModal(false);
      onReload();
    },
  });

  // 删除
  const { mutate: delKnowmutate } = useMutation({
    mutationFn: apiApplicationDelete,
    onSuccess: () => {
      onReload();
    },
  });

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: "确认删除此应用吗?",
      icon: <ExclamationCircleOutlined />,
      content: "",
      okText: "是",
      okType: "primary",
      cancelText: "否",
      onOk: () => {
        delKnowmutate({
          application_ids: [detail.application_id],
        });
      },
    });
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    e.key === "edit" && setEditModal(true);
    e.key === "del" && showDeleteConfirm();
  };

  return (
    <div className="border-card cursor-pointer" onClick={goChat}>
      <div className="flex justify-between items-center py-4 px-8 mt-2">
        <div className="flex justify-between items-center flex-1 overflow-x-hidden">
          <span className="icon-[app--card-icon] mr-2 text-[24px]"></span>
          <span className="font-bold text-ellipsis flex-1 text-title text-18">
            {detail.application_name}
          </span>
        </div>
        <div className="cursor-pointer">
          <Dropdown
            placement="bottom"
            overlayClassName="no-padding-pover"
            menu={{
              items,
              onClick: (e) => {
                e.domEvent.stopPropagation();
                handleMenuClick(e);
              },
            }}
          >
            <span className="icon-[base--more] mr-2 text-[24px] hover:icon-hover-[base--more-h]"></span>
          </Dropdown>
        </div>
      </div>
      {/* 应用介绍 */}
      <div className="text-secondTitle px-8 truncate2 leading-5 h-[38px]">
        {detail.application_description}
      </div>
      {/* 提示词 */}
      <div className="truncate font-medium px-5">
        <div className="inline-block truncate max-w-[100%] bg-[#E9EDFA] my-[20px] py-2 text-active  rounded-[20px] px-4">
          {detail.application_prompt}
        </div>
      </div>
      <div className="flex justify-between items-center flex-row px-8 h-[80px] border-solid border-t-[1px] border-b-0 border-l-0 border-r-0 border-light ">
        <div className="flex justify-between items-center flex-row py-2">
          <span className="icon-[base--time] text-16"></span>
          <span className="ml-2 text-normal">
            {formatDate(detail?.timestamp)}
          </span>
          <div className="w-[1px] bg-[#E4E9ED] h-[16px] mx-[10px]"></div>
          <span className="text-secondTitle">调用</span>
          <span className="text-active ml-2 font-semibold">
            {convertNumber(detail?.invoke_count || 0)}
          </span>
        </div>
        <div
          className="cursor-pointer text-active flex items-center py-2 px-4 border-radius2 bg-[#F6F9FB]"
          onClick={(e) => {
            e.stopPropagation();
            goChat();
          }}
        >
          <span className="icon-[base--chat] text-16"></span>
          <span className="ml-2">问答</span>
        </div>
      </div>
      {/* 编辑 */}
      {editModal && (
        <AddApp
          fetching={isPending}
          type="edit"
          show={editModal}
          appId={detail.application_id}
          handleCancel={handleCancel}
          onFinish={onFinish}
        />
      )}
    </div>
  );
};

export default AppCard;
