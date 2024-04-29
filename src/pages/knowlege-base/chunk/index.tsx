import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Input, Pagination, message } from "antd";
import type { SearchProps } from "antd/es/input/Search";
import { useState } from "react";
import { useImmer } from "use-immer";

import { apiChunkAdd, apiChunkList } from "@/api/document";
import SearchIcon from "@/assets/knowlege-base/search1.svg";
import Back from "@/components/back";
import FileIcon from "@/components/file-icon";
import { useQueryParams } from "@/hook";
import type { IchunkList } from "@/types";
import { delay } from "@/utils";

import AddChunk from "./addChunk";
import ChunkCard from "./card";

const searchStyle = {
  width: 360,
  height: "20px",
};
const suffix = <img src={SearchIcon} />;

const KnowlegeBaseChunk: React.FC = () => {
  const { Search } = Input;
  // 使用useParams获取路由参数
  const paramsQuery = useQueryParams();

  const [show, setShow] = useState(false);

  const onSearch: SearchProps["onSearch"] = (value, _e) => {
    setListParams((draft) => {
      draft.page_num = 1;
      draft.keyword = value;
    });
  };

  // 初始化查询参数
  const [listParams, setListParams] = useImmer({
    kb_id: paramsQuery.kbid || "",
    file_id: paramsQuery.fileid || "",
    page_num: 1,
    page_size: 9,
    keyword: "",
  });

  // 页数切换
  const onChangePage = (page: number, pageSize: number) => {
    setListParams((draft) => {
      draft.page_num = page;
      draft.page_size = pageSize;
    });
  };

  // 获取列表
  const { data: chunklist, refetch: listRefetch } = useQuery({
    queryKey: ["chunklist", listParams],
    queryFn: () => apiChunkList(listParams),
  });

  // 新增
  const { mutate: AddMmtate, isPending } = useMutation({
    mutationFn: apiChunkAdd,
    onSuccess: () => {
      message.success("新增成功");
      setShow(() => false);
      reload("add");
    },
  });

  // 新增触发
  const onFinish = (value: { question: string; content: string }) => {
    AddMmtate({
      ...value,
      kb_id: paramsQuery?.kbid || "",
      file_id: paramsQuery?.fileid || "",
      file_name: paramsQuery?.filename || "",
    });
  };

  const reload = async (type: string) => {
    await delay(500);
    // 编辑删除不改变分页重新查询即可
    if (["del", "edit"].includes(type)) {
      listRefetch();
    } else {
      // 新增则回到第一页 触发查询
      setListParams((draft) => {
        draft.page_num = 1;
      });
      listRefetch();
    }
  };

  return (
    <div className="flex flex-col h-[100%] justify-between">
      {/* back */}
      <div className="pt-[24px] px-[60px]">
        <Back bread={paramsQuery.filename || ""} />
      </div>
      {/* 文档信息 */}
      <div className="mt-[40px] flex items-center flex-row px-[60px] h-[44px] justify-between">
        <div className="flex items-center flex-row h-[44px]">
          <div className="bg-[#F2F5FA] w-[44px] h-[44px] rounded-md flex justify-center items-center">
            <FileIcon name={paramsQuery.filename || ""} size="large"></FileIcon>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col justify-between h-[44px] font-medium ml-2">
              <div className="text-title  font-semibold">
                {paramsQuery.filename}
              </div>
              <div className="text-secondTitle">ID: {paramsQuery.fileid}</div>
            </div>
          </div>
        </div>
        <div>
          <Button
            type="primary"
            className="border-radius-0 ml-4 items-center flex"
            onClick={() => setShow(true)}
          >
            <span className="icon-[base--chunck-up] mr-2 text-16"></span>
            导入对话
          </Button>
        </div>
      </div>
      {/* 统计信息 */}
      <div className="mt-[20px] px-[60px] flex justify-between">
        <div className="mt flex justify-between items-center flex-row">
          <span className="icon-[base--chunk-total] mr-2 text-16"></span>
          共计
          <span className="text-active ml-1 font-bold">{chunklist?.total}</span>
          <span className="ml-1 mr-2 font-bold">组数据</span>
        </div>
        <div>
          {/* 搜索 */}
          <Search
            className="my-[20px] cec-inputSearch"
            placeholder="请输入chunk 名称查询"
            allowClear
            onSearch={onSearch}
            suffix={suffix}
            style={searchStyle}
          />
        </div>
      </div>
      {/* 卡片 */}
      <div className="flex-1 mt-[10px] px-[60px] overflow-auto">
        <div className="grid grid-cols-3 gap-4 h-[100%] mt-[10px]">
          {chunklist?.list.map((item: IchunkList, index: number) => {
            return (
              <ChunkCard
                index={index}
                detail={item}
                key={item.chunk_id}
                reload={reload}
              ></ChunkCard>
            );
          })}
        </div>
      </div>
      {/* 分页 */}
      <div className="bg-white min-h-[72px] mt-[20px] shadow-md pagination-wrap flex items-center justify-end px-[60px]">
        <Pagination
          showSizeChanger
          pageSize={listParams.page_size}
          pageSizeOptions={[9, 18, 27, 36, 45]}
          onChange={onChangePage}
          defaultCurrent={listParams.page_num}
          total={chunklist?.total || 0}
        />
      </div>
      {/* 新增 */}
      {show && (
        <AddChunk
          type="edit"
          detail={{ question: "", content: "" }}
          show={show}
          handleCancel={() => setShow(false)}
          onFinish={onFinish}
          fetching={isPending}
        ></AddChunk>
      )}
    </div>
  );
};

export default KnowlegeBaseChunk;
