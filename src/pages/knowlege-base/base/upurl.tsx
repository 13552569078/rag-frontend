import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, Modal } from "antd";
import React, { useState } from "react";

import { apiUploadurl } from "@/api";
import { validateUrl } from "@/utils";

interface IFileUpload {
  show: boolean;
  query: { id: string; name: string; [k: string]: string };
  close: () => void;
  reload: () => void;
}

interface FieldType {
  url?: string;
}

const UpUrl: React.FC<IFileUpload> = ({ show, close, reload, query }) => {
  const [form] = Form.useForm();

  const [fetching, setFetching] = useState(false);

  // 上传url地址
  const onFinish = async (values: { url: string }) => {
    setFetching(() => true);
    apiUploadurlMutate({ kb_id: query.id, url: values.url });
  };

  // 上传url
  const { mutate: apiUploadurlMutate } = useMutation({
    mutationFn: apiUploadurl,
    onSuccess: () => {
      close();
      reload();
      setFetching(() => false);
    },
    onError: () => {
      setFetching(() => false);
    },
  });

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Modal
        title="上传网址"
        open={show}
        onCancel={close}
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
            label="上传网址"
            name="url"
            rules={[
              { required: true, message: "请输入网址!" },
              { validator: validateUrl },
            ]}
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
              <Button onClick={close}>取消</Button>
              <Button
                type="primary"
                htmlType="submit"
                className="ml-2"
                loading={fetching}
              >
                确认
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UpUrl;
