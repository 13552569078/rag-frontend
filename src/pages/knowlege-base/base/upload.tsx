import { useMutation } from "@tanstack/react-query";
import { Button, Modal, Upload, message } from "antd";
import type { GetProp, UploadProps } from "antd";
import React, { useState } from "react";
import { useImmer } from "use-immer";

import { apiCheckFfilesExist } from "@/api";
import { apiFileUploadUrl } from "@/api/document";
import FileIcon from "@/components/file-icon";
import {
  FILE_SIZE,
  FILE_TYPE,
  FILE_TYPE_CSV,
  FILE_TYPE_PPT,
} from "@/constants";
import { useUserStore } from "@/store/useUser";
import type { IsourceType } from "@/types";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const { Dragger } = Upload;
interface IFileUpload {
  show: boolean;
  query: { id: string; name: string; [k: string]: string };
  close: () => void;
  reload: () => void;
  sourceType: IsourceType;
}

const titleMap = {
  file: "上传文档",
  ppt: "上传PPT",
  table: "上传CSV",
};

const FileTypeMap = {
  file: FILE_TYPE,
  ppt: FILE_TYPE_PPT,
  table: FILE_TYPE_CSV,
};

const searchTypeMap = {
  file: "doc",
  ppt: "ppt",
  table: "csv",
};

const FileUpload: React.FC<IFileUpload> = ({
  show,
  close,
  reload,
  query,
  sourceType,
}) => {
  const [modal, contextHolder] = Modal.useModal();

  const [fileList, setFileList] = useImmer<FileType[]>([]);

  const [fetching, setFetching] = useState(false);

  // 用户信息
  const { userInfo } = useUserStore();

  const title = titleMap[sourceType];
  const accept = FileTypeMap[sourceType];

  const beforeUploadHandler = async (file: FileType) => {
    // 文档后缀错误 则不添加
    const suffix = file.name.split(".").pop()?.toLowerCase();
    if (!accept.includes(suffix as string)) {
      message.error(`只允许上传${FILE_TYPE}格式文件`);
      return false;
    }
    const isLt20M = file.size / 1024 / 1024 < FILE_SIZE;
    if (!isLt20M) {
      message.error("最大上传为20M");
      return false;
    }
    // 限制同名文件上传
    const inFile = fileList.find((item: any) => {
      return item.name === file.name;
    });
    if (inFile) return false;

    // 添加本次文件
    setFileList((pre) => [...pre, file]);
    return false;
  };

  // 校验文章重复
  const { mutate: apiCheckFfilesExistMutate } = useMutation({
    mutationFn: apiCheckFfilesExist,
    onSuccess: (e) => {
      if (e.length) {
        modal.confirm({
          title: "提示",
          content: (
            <div>
              以下文件已存在，是否继续上传！
              {e.map((item, index) => {
                return (
                  <div className="text-active" key={index}>
                    {index + 1}: {item}
                  </div>
                );
              })}
            </div>
          ),
          okText: "确认",
          onOk: () => {
            uplolad();
          },
          cancelText: "取消",
        });
      } else {
        uplolad();
      }
    },
  });

  const uploladCheck = () => {
    const file_names = fileList.map((item) => item.name);
    apiCheckFfilesExistMutate({ kb_id: query.id, file_names });
  };

  const uplolad = async () => {
    const formData = new FormData();
    for (let i = 0; i < fileList.length; i += 1) {
      formData.append("files", fileList[i]);
    }
    formData.append("kb_id", query.id);
    formData.append("user_id", userInfo.id);
    formData.append("file_type", searchTypeMap[sourceType]);
    // 上传模式，soft：文件名重复的文件不再上传，strong：文件名重复的文件强制上传
    formData.append("mode", "strong");

    setFetching(() => true);
    fetch(`${apiFileUploadUrl}`, {
      method: "POST",
      headers: {
        Authorization: userInfo.token,
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // 将响应解析为 JSON
        }
        throw new Error("上传失败");
      })
      .then((data) => {
        // 在此处对接口返回的数据进行处理
        if (data.code === 200) {
          message.success("上传成功");
          close();
          reload();
          setFetching(() => false);
        } else {
          message.error("上传失败");
          setFetching(() => false);
        }
      })
      .catch((error) => {
        console.log(error, "error");
        setFetching(() => false);
      });
  };

  // 自定义 fileList 的渲染
  const customRenderList = (fileList: any) => {
    return fileList.map((file: any, index: number) => (
      <div
        key={file.uid}
        style={{ marginBottom: 8 }}
        className="flex h-[50px] bg-white items-center border-[#E4E9ED] border-[1px] border-solid mt-2 justify-between px-3"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <p className="text-ellipsis flex flex-1 items-center">
          <FileIcon name={file.name}></FileIcon>
          <div className="ml-2 truncate">{file.name}</div>
        </p>
        <span
          className="icon-[base--close] cursor-pointer w-[30px]"
          onClick={() => delFile(index)}
        ></span>
      </div>
    ));
  };

  const delFile = (index: number) => {
    setFileList((pre) => pre.filter((_, idx) => idx !== index));
  };

  return (
    <Modal
      title={title}
      open={show}
      onOk={uploladCheck}
      onCancel={close}
      width={580}
      footer={[
        <Button key="back" onClick={close}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={fetching}
          disabled={!fileList.length}
          onClick={uploladCheck}
        >
          确认
        </Button>,
      ]}
    >
      <Dragger
        name="file"
        multiple={true}
        accept={accept}
        fileList={fileList}
        showUploadList={false}
        beforeUpload={beforeUploadHandler}
      >
        <div className="h-[160px] justify-center flex flex-col bg-white items-center">
          <span className="icon-[base--file-upload] mb-2 text-[20px]"></span>
          <p className="ant-upload-text">
            请将文件拖转到此处，或者
            <span className="text-active">点击上传</span>
          </p>
          <p className="ant-upload-hint">
            <span>只允许上传</span>
            <span className="text-active">{accept}</span>
            <span>格式文件,单个文件小于</span>
            <span className="text-active">{FILE_SIZE}</span>
            <span>M</span>
          </p>
        </div>
      </Dragger>
      {/* csv则显示下载模板 */}
      {sourceType === "table" && (
        <div className="cursor-pointer my-2 text-[12px] mb-2">
          <span>请下载</span>
          <span className="text-active mx-1">点击下载CSV模版</span>
          <span>并按照模板编辑</span>
        </div>
      )}
      {/* 自定义已上传文件列表 */}
      <div>{customRenderList(fileList)}</div>
      {contextHolder}
    </Modal>
  );
};

export default FileUpload;
