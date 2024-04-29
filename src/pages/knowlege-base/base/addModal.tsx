import { Button, Form, Input, Modal } from "antd";
import React from "react";

interface IAddKnowBase {
  show: boolean;
  fetching: boolean;
  type: string;
  detail: {
    kb_id: string;
    kb_name: string;
  };
  handleCancel: (e: React.MouseEvent<HTMLElement>) => void;
  onFinish: (e: { knowbaseName: string }) => void;
}

export interface FieldType {
  knowbaseName: string;
}

const AddKnowBase: React.FC<IAddKnowBase> = ({
  show,
  detail,
  type,
  handleCancel,
  onFinish,
  fetching,
}) => {
  const [form] = Form.useForm();

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Modal
        title={`${type === "edit" ? "编辑" : "新建"}知识空间`}
        open={show}
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
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="知识空间名称"
            name="knowbaseName"
            rules={[{ required: true, message: "请输入知识空间名称!" }]}
          >
            <Input
              placeholder="请输入知识空间名称"
              defaultValue={detail.kb_name}
              onChange={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              onAbort={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
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
                {`${type === "edit" ? "修改" : "确认"}`}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddKnowBase;
