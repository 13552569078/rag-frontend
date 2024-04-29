import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "antd";
import { useState } from "react";

import { apiAddKnowledgeBase, apiKnowledgeBaseList } from "@/api";
import { useBaseStore } from "@/store/useBase";
import type { IknowBase } from "@/types";

import AddKnowBase from "./base/addModal.tsx";
import type { FieldType } from "./base/addModal.tsx";
import KnowlegeCard from "./base/card.tsx";

export default function KnowlegeBase() {
  const [addModal, setAddModal] = useState(false);

  // 在这里引入所需状态
  const { searchName } = useBaseStore();

  const reload = () => {
    listRefetch();
    setAddModal(false);
  };

  // 新增知识库
  const { mutate: addKnowmutate, isPending } = useMutation({
    mutationFn: apiAddKnowledgeBase,
    onSuccess: () => {
      reload();
    },
  });

  // 获取列表
  const { data: KnowledgeBaseList, refetch: listRefetch } = useQuery({
    queryKey: ["knowBaselist"], // searchName 后期增加后端接口查询
    queryFn: async () => {
      const data = await apiKnowledgeBaseList({});
      return data.map((item) => {
        return {
          ...item,
          kb_name: item.kb_name || "名称为空",
        };
      });
    },
  });

  // 筛选知识库
  const filterList = KnowledgeBaseList?.filter((item: IknowBase) => {
    return item.kb_name && item.kb_name.includes(searchName);
  });

  // 新增数据库
  const handelAdd = async (values: FieldType) => {
    addKnowmutate({ kb_name: values.knowbaseName });
  };

  return (
    <div className="py-[24px] px-[60px]">
      {/* <div className="my-component"></div> */}
      <h2 className="text-title">知识库管理</h2>
      <p className="text-normal mt-2 mb-2">实现全域散落知识的一体化管理</p>
      {/* 总数及新增 */}
      <div className="my-4 flex justify-between items-center flex-row">
        <div className="mt-2 mb-2 flex justify-between items-center flex-row">
          <span className="icon-[base--total] mr-2"></span>共
          <span className="text-active mr-2 ml-2 font-bold">
            {/* 有搜索则展示搜索条数 */}
            {filterList?.length}
          </span>
          <span className="text-normal">条数据</span>
        </div>
        <div>
          <Button
            type="primary"
            onClick={() => setAddModal(true)}
            className="border-radus-0"
            icon={<PlusOutlined />}
          >
            新建知识空间
          </Button>
        </div>
      </div>
      {/* card卡片 */}
      <div className="grid grid-cols-4 gap-4">
        {filterList?.map((item: IknowBase, index: number) => {
          return <KnowlegeCard key={index} detail={item} onReload={reload} />;
        })}
      </div>
      {/* 新增 */}
      {addModal && (
        <AddKnowBase
          type="add"
          show={addModal}
          fetching={isPending}
          detail={JSON.parse(JSON.stringify({ kb_id: "", kb_name: "" }))}
          handleCancel={() => setAddModal(false)}
          onFinish={handelAdd}
        />
      )}
    </div>
  );
}
