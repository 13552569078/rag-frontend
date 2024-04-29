import { useMount } from "ahooks";
import { Button, Form, Input, Modal } from "antd";
import React from "react";

interface IAddChunk {
  show: boolean;
  fetching: boolean;
  type: string;
  detail: {
    question: string;
    content: string;
  };
  handleCancel: (e: React.MouseEvent<HTMLElement>) => void;
  onFinish: (e: { question: string; content: string }) => void;
}

export interface FieldType {
  question: string;
  content: string;
}

const AddChunk: React.FC<IAddChunk> = ({
  show,
  detail,
  type,
  handleCancel,
  onFinish,
  fetching,
}) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;

  useMount(() => {
    form.setFieldsValue(detail);
  });

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Modal
        title={`${type === "edit" ? "编辑" : "新建"}`}
        open={show}
        onCancel={handleCancel}
        footer={null}
        width={800}
        getContainer={false}
      >
        <Form
          form={form}
          name="basic"
          className="mt-4"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 800 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="问题"
            name="question"
            rules={[{ required: true, message: "请输入问题!" }]}
          >
            <TextArea
              placeholder="请输入问题"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
          <Form.Item<FieldType>
            label="回答"
            name="content"
            rules={[{ required: true, message: "请输入回答!" }]}
          >
            <TextArea
              placeholder="请输入回答"
              autoSize={{ minRows: 3, maxRows: 10 }}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 15 }}>
            <div className="flex justify-end mt-2">
              <Button onClick={handleCancel}>取消</Button>
              <Button
                type="primary"
                htmlType="submit"
                className="ml-2"
                loading={fetching}
              >
                {`${type === "edit" ? "保存" : "确认"}`}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddChunk;
