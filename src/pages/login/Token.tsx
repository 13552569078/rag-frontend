import { Button, Form, Input, Modal } from "antd";
import React from "react";

interface MyComponentProps {
  onFinish: (e: { token: string }) => void;
}

interface FieldType {
  token?: string;
}

const Token: React.FC<MyComponentProps> = ({ onFinish }) => {
  const [form] = Form.useForm();

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Modal
        title="请输入口令"
        open={true}
        footer={null}
        getContainer={false}
        closeIcon={false}
      >
        <Form
          form={form}
          name="basic"
          className="mt-4"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 500 }}
          initialValues={{ remember: false }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="输入口令"
            name="token"
            rules={[{ required: true, message: "请输入口令!" }]}
          >
            <Input
              onChange={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              onAbort={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 15 }}>
            <div className="flex justify-end">
              <Button type="primary" htmlType="submit" className="ml-2">
                确认
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Token;
