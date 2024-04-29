import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Dropdown, Modal, message } from "antd";
import type { MenuProps } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiDelKnowledgeBase, apiGeteditKnowledgeBase } from "@/api";
import type { IknowBase } from "@/types";
import { formatDate } from "@/utils";

import AddKnowBase from "./addModal";

interface MyComponentProps {
  key: number;
  detail: IknowBase;
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

const Home: React.FC<MyComponentProps> = ({ detail, onReload }) => {
  const [editModal, setEditModal] = useState(false);

  const navgite = useNavigate();

  const showPreview = () => {
    navgite({
      pathname: "/knowlegeBaseDetail",
      search: `name=${detail.kb_name}&id=${detail.kb_id}`,
    });
  };

  // 知识库会话
  const goChat = () => {
    if (!detail.file_count) {
      message.info("文档未上传，请先上传");
      return false;
    }
    if (detail.file_count && !detail.page_size) {
      message.info("文档未解析，请先解析文档");
      return false;
    }
    // 跳转知识库会话
    navgite({
      pathname: "/knowlegeBaseChat",
      search: `kbname=${detail.kb_name}&kbid=${detail.kb_id}`,
    });
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setEditModal(false);
  };

  const onFinish = (values: { knowbaseName: string }) => {
    editKnowmutate({
      new_kb_name: values.knowbaseName,
      kb_id: detail.kb_id,
    });
    setEditModal(false);
  };

  // 编辑
  const { mutate: editKnowmutate } = useMutation({
    mutationFn: apiGeteditKnowledgeBase,
    onSuccess: () => {
      onReload();
    },
  });

  // 删除
  const { mutate: delKnowmutate } = useMutation({
    mutationFn: apiDelKnowledgeBase,
    onSuccess: () => {
      onReload();
    },
  });

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: "确认删除此项目吗?",
      icon: <ExclamationCircleOutlined />, // 这是一个可选的图标组件
      content: "", // 可以添加一些额外的提示内容
      okText: "是",
      okType: "primary",
      cancelText: "否",
      onOk: () => {
        delKnowmutate({
          kb_ids: [detail.kb_id],
        });
      },
    });
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    e.key === "edit" && setEditModal(true);
    e.key === "del" && showDeleteConfirm();
  };

  return (
    <div className="border-card cursor-pointer" onClick={showPreview}>
      {/* title */}
      <div className="flex justify-between items-center py-4 px-8 mt-2">
        <div className="flex justify-between items-center flex-1 overflow-x-hidden">
          <span className="icon-[base--card-icon] mr-2 text-[24px]"></span>
          <span className="font-bold text-ellipsis flex-1 text-title text-18">
            {detail.kb_name}知识空间
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
      {/* 文档数量 总页数 */}
      <div className="flex items-center flex-row mt-4 px-8 mb-[30px] ">
        <div className="flex-1">
          <div className="font-bold text-secondTitle text-[14px]">文档数量</div>
          <div className="text-lg font-bold mt-2">
            <span className="text-[24px]">{detail?.file_count || 0}</span>
            <span className="ml-[4px] text-sm text-secondTitle">个</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="font-bold text-secondTitle text-[14px]">总页数</div>
          <div className="text-lg font-bold mt-2">
            <span className="text-[24px]">{detail?.page_size || 0}</span>
            <span className="ml-[4px] text-sm text-secondTitle">页</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center flex-row px-8 h-[80px] border-solid border-t-[1px] border-b-0 border-l-0 border-r-0 border-light">
        <div className="flex justify-between items-center flex-row py-2">
          <span className="icon-[base--time] text-16"></span>
          <span className="ml-2 text-normal">
            {" "}
            {formatDate(detail?.timestamp)}
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
        <AddKnowBase
          fetching={false}
          type="edit"
          show={editModal}
          detail={detail}
          handleCancel={handleCancel}
          onFinish={onFinish}
        />
      )}
    </div>
  );
};

export default Home;
