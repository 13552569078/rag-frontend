import { useMutation } from "@tanstack/react-query";
import { Button, Modal, message } from "antd";
import { useState } from "react";

import { apiChunkListDel, apiChunkUpdate } from "@/api/document";
import { useQueryParams } from "@/hook";
import type { IchunkList } from "@/types";

import AddChunk from "./addChunk";

type ReloadType = "add" | "del" | "edit";

interface MyComponentProps {
  index: number;
  detail: IchunkList;
  reload: (type: ReloadType) => void;
}

const ChunkCard: React.FC<MyComponentProps> = ({ index, detail, reload }) => {
  // 使用useParams获取路由参数
  const paramsQuery = useQueryParams();

  const [show, setShow] = useState(false);

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: "确认删除此Chunck吗?",
      content: "", // 可以添加一些额外的提示内容
      okText: "是",
      okType: "primary",
      cancelText: "否",
      onOk: () => {
        delMutate({
          kb_id: paramsQuery?.kbid || "",
          file_id: paramsQuery?.fileid || "",
          chunk_id: detail.chunk_id || "",
        });
      },
    });
  };

  // 删除
  const { mutate: delMutate } = useMutation({
    mutationFn: apiChunkListDel,
    onSuccess: () => {
      message.success("删除成功");
      reload("del");
    },
  });

  // 编辑
  const { mutate: updateMmtate, isPending } = useMutation({
    mutationFn: apiChunkUpdate,
    onSuccess: () => {
      message.success("编辑成功");
      setShow(() => false);
      reload("edit");
    },
  });

  // 编辑触发
  const onFinish = (value: { question: string; content: string }) => {
    updateMmtate({
      ...value,
      kb_id: paramsQuery?.kbid || "",
      file_id: paramsQuery?.fileid || "",
      chunk_id: detail.chunk_id || "",
    });
  };

  return (
    <div className="border-card cursor-pointer p-[20px] h-[220px]">
      <div className="h-[26px] flex items-center">
        <div className="min-w-[40px] h-[100%] flex justify-center items-center bg-[#E9EDFA] text-active font-bold">
          {index + 1}
        </div>
        <div className="text-normal font-semibold truncate felx-1 ml-2">
          {detail.question}
        </div>
      </div>
      <div className="bg-[#F6F9FB] text-[#8A8A8A] p-[13px] leading-6 h-[90px] truncate3 mt-[14px]">
        {detail.content}
      </div>
      <div className="mt-[20px] flex justify-between items-center">
        <div className="text-secondTitle">ID: {detail.chunk_id}</div>
        <div className="text-secondTitle">
          <Button
            size="small"
            className="bg-[#E9EDFA] text-active"
            onClick={showDeleteConfirm}
          >
            {""}删除 {""}
          </Button>
          <Button
            type="primary"
            size="small"
            className="ml-2"
            onClick={() => setShow(true)}
          >
            <span>
              {""}编辑 {""}
            </span>
          </Button>
        </div>
      </div>
      {/* 编辑 */}
      {show && (
        <AddChunk
          type="edit"
          detail={detail}
          show={show}
          handleCancel={() => setShow(false)}
          onFinish={onFinish}
          fetching={isPending}
        ></AddChunk>
      )}
    </div>
  );
};

export default ChunkCard;
