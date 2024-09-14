import React from "react";
import { Button, Input, Modal, Select, DatePicker, Form } from "antd";
import { Dayjs } from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "../store/taskSlice";
import { RootState } from "../store/store";
import { useTodo } from "../hooks/AddTask";
import toast from "react-hot-toast";
const { Option } = Select;
interface FormValues {
  title: string;
  description: string;
  priority: string;
  dueDate: Dayjs | null | undefined;
}
interface TaskFormProps {
  visible: boolean;
  onSubmit: (values: Task) => void;
  onCancel: () => void;
}
interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  dueDate: string | null;
  status: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ onCancel }) => {
  const username = useSelector((state: RootState) => state.auth.user.username);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleFormSubmit = async (values: FormValues) => {
    console.log(values);

    if (username) {
      const response = await useTodo(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/todo`,
        "addtodo",
        values
      );
      console.log(response);
      if (response) {
        toast.success("Todo Added");
        dispatch(
          addTask({
            id: response.todo._id.toString(),
            description: response.todo.description,
            priority: response.todo.priority,
            title: response.todo.title,
            status: response.todo.status,
            dueDate: values.dueDate?.toString() || null,
          })
        );
      } else {
        toast.error("Failed to add Todo");
      }
    } else
      dispatch(
        addTask({
          id: Date.now().toString(),
          ...values,
          dueDate: values.dueDate?.toString() || null,
        } as Task)
      );
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      visible={true}
      title="Add New Task"
      footer={null}
      onCancel={onCancel}
      className="modal"
    >
      <Form form={form} onFinish={handleFormSubmit} layout="vertical">
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input the title!" }]}
        >
          <Input placeholder="Task title" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Task description" rows={4} />
        </Form.Item>

        <Form.Item
          label="Priority"
          name="priority"
          rules={[{ required: true, message: "Please select a priority!" }]}
        >
          <Select placeholder="Select priority" className="w-full">
            <Option value="high" className="bg-red-500 text-white">
              High
            </Option>
            <Option value="medium" className="bg-yellow-500 text-black">
              Medium
            </Option>
            <Option value="low" className="bg-green-500 text-white">
              Low
            </Option>
          </Select>
        </Form.Item>

        <Form.Item label="Due Date" name="dueDate" rules={[{ required: true }]}>
          <DatePicker format="YYYY-MM-DD" className="w-full" allowClear />
        </Form.Item>

        <Form.Item>
          <Button htmlType="submit" className="w-full">
            Add Task
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;
