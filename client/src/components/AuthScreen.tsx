import React from "react";
import { Button, Input, Modal, Form } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/AuthHookes";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { setTasks } from "../store/taskSlice";
const LoginScreen: React.FC<{ visible: boolean; onClose: () => void }> = ({
  visible,
  onClose,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleFormSubmit = async (values: any) => {
    console.log("Login values:", values);
    const response = await useAuth(
      "http://localhost:8080/api/v1/login",
      "login",
      values
    );
    if (response)
      toast.success(`Login Successfully
      Your username :- ${response.username}
      `);
    else {
      toast.error("login failed");
      form.resetFields();
      return;
    }
    dispatch(login({ username: response.username }));
    dispatch(setTasks([]));
    localStorage.setItem("token", response.token);

    form.resetFields();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      title="Login"
      onCancel={onClose}
      footer={null}
      className="login-modal"
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
            Login
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginScreen;
