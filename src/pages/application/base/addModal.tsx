import { useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Popover, Select } from "antd";
import React from "react";

import { apiApplicationDetail, apiKnowledgeBaseList, apiLlmList } from "@/api";
import type { IApplicationCreate } from "@/types";

interface IAddApp {
  show: boolean;
  fetching: boolean;
  type: string;
  appId?: string;
  handleCancel: (e: React.MouseEvent<HTMLElement>) => void;
  onFinish: (value: IApplicationCreate, e: IApplicationCreate) => void;
}

const AddApp: React.FC<IAddApp> = ({
  show,
  type,
  handleCancel,
  onFinish,
  fetching,
  appId = "",
}) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;

  // 获取应用详情
  const { data: detail, isPending } = useQuery({
    queryKey: ["appDetail"], // searchName 后期增加后端接口查询
    queryFn: async () => {
      if (type === "edit") {
        const data = await apiApplicationDetail({ application_id: appId });
        form.setFieldsValue(data);
        return data;
      } else if (type === "add") {
        const details = {
          application_name: "",
          llm_model_name: null,
          application_description: "",
          kb_ids: [],
          application_prompt: "",
        };
        form.setFieldsValue(details);
        return details;
      }
    },
  });

  // 获取知识库列表
  const { data: KnowledgeBaseList } = useQuery({
    queryKey: ["knowBaselist"], // searchName 后期增加后端接口查询
    queryFn: () => apiKnowledgeBaseList({}),
  });

  // 获取LLm
  const { data: llmList } = useQuery({
    queryKey: ["llmList"], // searchName 后期增加后端接口查询
    queryFn: apiLlmList,
  });

  const content = (
    <div className="w-[260px]">
      模型固定的引导词，通过调整该内容，可以引导模型聊天方向。该内容会被固定在上下文的开头。可使用变量,
      如果关联了知识库，你还可以通过适当的描述，来引导模型何时去调用知识库搜索。例如:
      <div className="mt-2"></div>
      <p>
        指令:据已知信息，简洁和专业的来回答我的问题。前面的已知信息可能有用，也可能没用，你需要从我给出的已知信息中选出与我的问题最相关的那些，来为你的回答提供依据。回答一定要忠于原文，简洁但不丢信息，不要胡乱编造。我的问题或指令是什么语种，你就用什么语种回复。如果无法从已知信息得到答案，请说"根据已知信息无法回答该问题"
      </p>
    </div>
  );

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Modal
        title={`${type === "edit" ? "编辑" : "新建"}应用`}
        open={show && !isPending}
        onCancel={handleCancel}
        footer={null}
        getContainer={false}
      >
        <Form
          form={form}
          name="basic"
          className="mt-4"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 500 }}
          initialValues={{ remember: false }}
          onFinish={(e) => onFinish(e, detail as IApplicationCreate)}
          autoComplete="off"
        >
          <Form.Item<IApplicationCreate>
            label="应用名称"
            name="application_name"
            rules={[{ required: true, message: "请输入应用名称!" }]}
          >
            <Input placeholder="请输入应用名称" />
          </Form.Item>
          {/* 编辑仅仅编辑名称 */}
          {type !== "edit" && (
            <>
              <Form.Item<IApplicationCreate>
                name="llm_model_name"
                label="选择模型"
                rules={[{ required: true, message: "请选择模型!" }]}
              >
                <Select placeholder="请选择模型">
                  {llmList?.map((item) => {
                    return (
                      <Select.Option
                        value={item.model_name}
                        key={item.model_name}
                      >
                        {item.model_name_cn}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item<IApplicationCreate>
                label="知识空间"
                name="kb_ids"
                rules={[{ required: true, message: "请选择知识空间!" }]}
              >
                <Select mode="multiple" placeholder="请选择知识空间">
                  {KnowledgeBaseList?.map((item) => {
                    return (
                      <Select.Option value={item.kb_id} key={item.kb_id}>
                        {item.kb_name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item<IApplicationCreate>
                label={
                  <Popover content={content}>
                    <div className="flex items-center cursor-pointer">
                      <span className="ml-1 text-[12px]">提示词</span>
                      <span className="icon-[app--form-info] hover:icon-[app--form-info-active]  ml-2"></span>
                    </div>
                  </Popover>
                }
                name="application_prompt"
                rules={[{ required: true, message: "请输入提示词!" }]}
              >
                <Input placeholder="请输入提示词,必须包含{question}字段，用于优化提问" />
              </Form.Item>
              <Form.Item<IApplicationCreate>
                label="应用介绍"
                name="application_description"
                rules={[{ required: true, message: "请输入应用介绍!" }]}
              >
                <TextArea
                  placeholder="请输入应用介绍"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              </Form.Item>
            </>
          )}
          <Form.Item wrapperCol={{ offset: 15 }}>
            <div className="flex justify-end mt-2">
              <Button onClick={handleCancel}>取消</Button>
              <Button
                type="primary"
                htmlType="submit"
                className="ml-2"
                loading={fetching}
              >
                {`${type === "edit" ? "修改" : "确认"}`}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddApp;
