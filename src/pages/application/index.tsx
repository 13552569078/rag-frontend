import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "antd";
import { useState } from "react";

import { apiApplicationAdd, apiApplicationList } from "@/api";
import { useBaseStore } from "@/store/useBase";
import type { IApplicationList } from "@/types";

import AddApp from "./base/addModal.tsx";
import AppCard from "./base/card.tsx";

export default function KnowlegeBase() {
  const [addModal, setAddModal] = useState(false);

  const { searchName } = useBaseStore();

  const reload = () => {
    listRefetch();
    setAddModal(false);
  };

  // 新增应用
  const { mutate: addAppmutate, isPending } = useMutation({
    mutationFn: apiApplicationAdd,
    onSuccess: () => {
      reload();
    },
  });

  // 获取列表
  const { data: applicationList, refetch: listRefetch } = useQuery({
    queryKey: ["applist"],
    queryFn: async () => {
      const data = await apiApplicationList();
      return data;
    },
  });

  // 筛选知应用
  const filterList = applicationList?.filter((item: IApplicationList) => {
    return item.application_name && item.application_name.includes(searchName);
  });

  // 新增应用
  const handelAdd = async (values: any) => {
    addAppmutate(values);
  };

  return (
    <div className="py-[24px] px-[60px]">
      <h2 className="text-title">智能应用</h2>
      <p className="text-normal mt-2 mb-2">
        您可以立即体验基于星智大模型的AI应用，也可以快速创建我的应用
      </p>
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
            新建应用
          </Button>
        </div>
      </div>
      {/* card卡片 */}
      <div className="grid grid-cols-4 gap-4">
        {filterList?.map((item: IApplicationList, index: number) => {
          return <AppCard key={index} detail={item} onReload={reload} />;
        })}
      </div>
      {/* 新增 */}
      {addModal && (
        <AddApp
          type="add"
          show={addModal}
          fetching={isPending}
          handleCancel={() => setAddModal(false)}
          onFinish={handelAdd}
        />
      )}
    </div>
  );
}
