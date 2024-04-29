import { useMutation } from "@tanstack/react-query";
import { Modal, Progress, Table, message } from "antd";
import type { TableProps } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

import { apiDeleteFile } from "@/api";
import SuccessIcon from "@/assets/knowlege-base/success.svg";
import TwoInfo from "@/assets/knowlege-base/TwoInfo.svg";
import FileIcon from "@/components/file-icon";
import type { Iknowfile } from "@/types";
import { fileDownload, formatDate, formatFileSize } from "@/utils";

interface MyComponentProps {
  list: Iknowfile[];
  query: { id: string; name: string; [k: string]: string };
  reload: () => void;
}

const FileTable: React.FC<MyComponentProps> = ({ list, query, reload }) => {
  const navgite = useNavigate();

  const myList = list
    ? list?.map((item, index) => {
        return {
          ...item,
          index: index + 1,
          bytes: formatFileSize(item?.bytes || 0),
          createtime: formatDate(item?.timestamp),
          errortext:
            item?.status === "gray" || item?.status === "green"
              ? ""
              : item?.msg,
        };
      })
    : [];

  const parseStatus = (status: string) => {
    let str = "解析失败";
    switch (status) {
      case "gray":
        str = "解析中";
        break;
      case "green":
        str = "解析成功";
        break;
      default:
        break;
    }
    return str;
  };

  const confirm = (item: Iknowfile) => {
    mutate({
      kb_id: query.id,
      file_ids: [item.file_id],
    });
  };

  const { mutate } = useMutation({
    mutationFn: apiDeleteFile,
    onSuccess: () => {
      message.success("删除成功");
      reload();
    },
  });

  const columns: TableProps["columns"] = [
    {
      title: "",
      dataIndex: "index",
      key: "index",
      render: (text: string) => (
        <span className="text-[#bdbdbd] font-[500]">{text}</span>
      ),
      width: "40px",
    },
    {
      title: "文件名",
      dataIndex: "file_name",
      key: "file_name",
      width: "32%",
      render: (_, record) => (
        <div
          className="items-center flex"
          style={{ wordWrap: "break-word", wordBreak: "break-word" }}
        >
          <FileIcon name={record.url || record.file_name}></FileIcon>
          <span className="ml-2">{record.url || record.file_name}</span>
        </div>
      ),
    },
    {
      title: "上传日期",
      dataIndex: "createtime",
      key: "createtime",
      width: "10%",
    },
    {
      title: "页数",
      dataIndex: "file_page",
      key: "file_page",
      render: (text) => <>{text >= 0 ? text : "--"}</>,
    },
    {
      title: "大小",
      dataIndex: "bytes",
      key: "bytes",
    },
    {
      title: "类型",
      dataIndex: "createtime",
      key: "createtime",
      render: () => <>{query?.name}</>,
    },
    {
      title: "AI处理进度",
      dataIndex: "status",
      key: "status",
      width: "9%",
      render: (text, record) => (
        <div className="items-center flex">
          {(text === "gray" || text === "green") && (
            <Progress
              percent={text === "green" ? 100 : Number(record.progress) || 0}
              size="small"
              strokeColor="#4CC09E"
              format={() =>
                text === "green" && <img src={SuccessIcon} alt="icon" />
              }
            />
          )}
          {/* 异常则无进度 */}
          {text === "red" && (
            <span>
              <img src={TwoInfo} alt="解析失败"></img>
              <span className="ml-2 text-[#FF4D4F] text-[14px]">
                {parseStatus(text)}
              </span>
            </span>
          )}
        </div>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: "240px",
      render: (_, record) => (
        <div className="flex">
          <span
            className={`text-active cursor-pointer ml-0 text-btn ${
              record.status !== "green" ? "disabled text-disabled" : null
            }`}
            onClick={() => goChat(record)}
          >
            问答
          </span>
          <span
            className="text-active cursor-pointer ml-3"
            onClick={() => fileDownload(record.minio_url, record.file_name)}
          >
            下载
          </span>
          {/* csv不允许预览 */}
          <span
            className={`text-active cursor-pointer text-btn ml-3 ${
              record.status !== "green" || record.file_type === "csv"
                ? "disabled text-disabled"
                : null
            }`}
            onClick={() => goFilePreview(record)}
          >
            预览
          </span>
          {/* <span
            className={`text-active cursor-pointer text-btn ml-3 ${
              record.status !== "green" || record.file_type === "csv"
                ? "disabled text-disabled"
                : null
            }`}
            onClick={() => goFileChunk(record)}
          >
            编辑
          </span> */}
          <span
            className="text-active cursor-pointer ml-3"
            onClick={() => showDeleteConfirm(record)}
          >
            删除
          </span>
        </div>
      ),
    },
  ];

  const showDeleteConfirm = (record: Iknowfile) => {
    Modal.confirm({
      title: "确认删除此文件吗?",
      content: "", // 可以添加一些额外的提示内容
      okText: "是",
      okType: "primary",
      cancelText: "否",
      onOk: () => {
        confirm(record);
      },
    });
  };

  // 跳转文档问答
  const goChat = (item: Iknowfile) => {
    // 文档名称 知识库id 文件fileid
    navgite({
      pathname: "/knowlegeBaseFileChat",
      search: `filename=${item.url || item.file_name}&kbid=${query.id}&fileid=${
        item.file_id
      }`,
    });
  };

  // 跳转预览
  const goFilePreview = (item: Iknowfile) => {
    // 文档名称 知识库id 文件fileid
    navgite({
      pathname: "/knowlegeBaseFilePreview",
      search: `filename=${item.url || item.file_name}&kbid=${query.id}&fileid=${
        item.file_id
      }`,
    });
  };

  // 跳转chunk
  // const goFileChunk = (item: Iknowfile) => {
  //   // 文档名称 知识库id 文件fileid
  //   navgite({
  //     pathname: "/knowlegeBaseChunk",
  //     search: `filename=${item.url || item.file_name}&kbid=${query.id}&fileid=${
  //       item.file_id
  //     }`,
  //   });
  // };

  return (
    <Table
      columns={columns}
      dataSource={myList}
      pagination={false}
      rowKey={(record) => record.file_id}
    />
  );
};

export default FileTable;
