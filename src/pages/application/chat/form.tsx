import { useQuery } from "@tanstack/react-query";
import { useMount } from "ahooks";
import { Form, Input, Popover, Select } from "antd";
import { debounce } from "native-lodash";
import React from "react";

import { apiKnowledgeBaseList, apiLlmList } from "@/api";
import type { IApplicationCreate } from "@/types";

import AppLink from "./appLink";

interface MyComponentProps {
  detail: IApplicationCreate;
  editFrom: (data: IApplicationCreate) => void;
  iframelink: string;
}

const AppForm: React.FC<MyComponentProps> = ({ detail, editFrom }) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;

  useMount(() => {
    form.setFieldsValue(detail);
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

  // 表单值变化的回调函数  1s防抖 避免重复触发
  const onValuesChange = async (
    _: IApplicationCreate,
    allValues: IApplicationCreate
  ) => {
    // form.validateFields() 返回失败
    form.validateFields().catch((e) => {
      if (e.errorFields.length === 0) {
        debounce(() => editFrom(allValues), 1000)();
      }
    });
  };

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
    <>
      <div className="bg-[#F9FAFE] pb-[28px] pt-[18px] px-[40px]">
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          autoComplete="off"
          onValuesChange={onValuesChange}
          className="no-required-form"
        >
          <Form.Item<IApplicationCreate>
            label={
              <div className="flex items-center">
                <span className="icon-[app--form-app]"></span>
                <span className="ml-1 text-[12px]">应用名称</span>
              </div>
            }
            name="application_name"
            rules={[{ required: true, message: "请输入应用名称!" }]}
          >
            <Input onChange={(e) => e.stopPropagation()} />
          </Form.Item>
          <Form.Item<IApplicationCreate>
            name="llm_model_name"
            label={
              <div className="flex items-center">
                <span className="icon-[app--form-box]"></span>
                <span className="ml-1 text-[12px]">选择模型</span>
              </div>
            }
            rules={[{ required: true, message: "请选择模型!" }]}
          >
            <Select>
              {llmList?.map((item) => {
                return (
                  <Select.Option value={item.model_name} key={item.model_name}>
                    {item.model_name_cn}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item<IApplicationCreate>
            label={
              <div className="flex items-center">
                <span className="icon-[app--konw]"></span>
                <span className="ml-1 text-[12px]">选择知识空间</span>
              </div>
            }
            name="kb_ids"
            rules={[{ required: true, message: "请选择知识空间!" }]}
          >
            <Select mode="multiple">
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
              <Popover content={content} placement="right">
                <div className="flex items-center">
                  <span className="icon-[app--form-news]"></span>
                  <span className="ml-1 text-[12px]">提示词</span>
                  <span className="icon-[app--form-info] hover:icon-[app--form-info-active]  ml-2"></span>
                </div>
              </Popover>
            }
            name="application_prompt"
            rules={[
              { required: true, message: "请输入提示词!" },
              // { validator: validateQuestion },
            ]}
          >
            <Input onChange={(e) => e.stopPropagation()} />
          </Form.Item>
          <Form.Item<IApplicationCreate>
            label={
              <div className="flex items-center">
                <span className="icon-[app--form-bookopen]"></span>
                <span className="ml-1 text-[12px]">应用介绍</span>
              </div>
            }
            name="application_description"
            rules={[{ required: true, message: "请输入应用介绍!" }]}
          >
            <TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              onChange={(e) => e.stopPropagation()}
            />
          </Form.Item>
        </Form>
      </div>
      <AppLink></AppLink>
    </>
  );
};

export default AppForm;
