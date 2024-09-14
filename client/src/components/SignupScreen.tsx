import React from "react";
import { Button, Input, Modal, Form } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/AuthHookes";
import { toast } from "react-hot-toast";
const SignupScreen: React.FC<{ visible: boolean; onClose: () => void }> = ({
  visible,
  onClose,
}) => {
  const [form] = Form.useForm();

  const handleFormSubmit = async (values: any) => {
    console.log("Signup values:", values);

    const response = await useAuth(
      "http://localhost:8080/api/v1/signup",
      "signup",
      values
    );
    if (response) toast.success("Signup successfully, login to proceed");
    else toast.error("Sign failed");

    form.resetFields();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      title="Signup"
      onCancel={onClose}
      footer={null}
      className="signup-modal"
    >
      <Form form={form} onFinish={handleFormSubmit} layout="vertical">
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-500" />}
            placeholder="Email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-500" />}
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Signup
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SignupScreen;
