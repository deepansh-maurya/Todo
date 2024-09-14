import { useEffect, useState } from "react";
import {
  List,
  Checkbox,
  Dropdown,
  Menu,
  Input,
  DatePicker,
  Button,
} from "antd";
import { MoreOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useTodo } from "../hooks/AddTask";
import { updateTask, removeTask, setTasks } from "../store/taskSlice";
interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  dueDate: string | null;
  status: string;
}

export default function Lists() {
  const username = useSelector((state: RootState) => state.auth.user.username);
  const dispatch = useDispatch();
  const tasksFromSlice = useSelector((state: RootState) => state.tasks.tasks);
  console.log(tasksFromSlice);

  const [tasks, setTask] = useState<Task[]>([]);
  const [visibleTask, setVisibleTask] = useState<string | null>(null);
  const [allowEdit, setAllowEdit] = useState<string | null>(null);
  const [updatedTodo, setUpdatedTodo] = useState<Partial<Task>>({});
  const [editPriority, setEditPriority] = useState({
    high: false,
    medium: false,
    low: false,
  });

  useEffect(() => {
    setTask(tasksFromSlice);
  }, [tasksFromSlice]);

  const handleTodoUpdation = async (task: Task) => {
    console.log(updatedTodo);

    if (username) {
      const response = await useTodo(
        "http://localhost:8080/api/v1/update-todo",
        "update-todo",
        updatedTodo
      );
      if (response) {
        dispatch(
          updateTask({
            id: updatedTodo.id || task.id,
            description: updatedTodo.description || task.description,
            priority: updatedTodo.priority || task.priority,
            title: updatedTodo.title || task.title,
            status: updatedTodo.status || task.status,
            dueDate: updatedTodo.dueDate || task.dueDate,
          })
        );
      }
    } else {
      dispatch(
        updateTask({
          id: updatedTodo.id || task.id,
          description: updatedTodo.description || task.description,
          priority: updatedTodo.priority || task.priority,
          title: updatedTodo.title || task.title,
          status: updatedTodo.status || task.status,
          dueDate: updatedTodo.dueDate || task.dueDate,
        })
      );
    }
    setUpdatedTodo({});
  };

  const toggleDescription = (id: string) => {
    setVisibleTask((prev) => (prev === id ? null : id));
  };

  const taskMenu = (id: string) => (
    <Menu>
      <Menu.Item
        onClick={() => {
          setAllowEdit(id);
          setVisibleTask(null);
          setUpdatedTodo((prev) => ({ ...prev, id }));
        }}
        key="1"
        icon={<EditOutlined />}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => {
          deleteTodo(id);
        }}
        icon={<DeleteOutlined />}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  const deleteTodo = async (id: string) => {
    console.log(id);
    if (username) {
      const response = await useTodo(
        "http://localhost:8080/api/v1/delete-todo",
        "delete-todo",
        id
      );
      const todos = response.todos;
      console.log(todos);

      dispatch(setTasks(todos));
    } else {
      dispatch(removeTask(id));
    }
  };

  return (
    <main className="flex-grow p-6 w-[70%] absolute flex h-[500px] top-20 overflow-y-scroll scrollbar-thin ">
      {tasks.length > 0 ? (
        <List
          className="shadow rounded-lg p-4 w-[100%] text-white opacity-[80%]"
          size="large"
          dataSource={tasks}
          renderItem={(task) => (
            <List.Item className="flex flex-col bg-black items-start text-white mb-4 rounded-md relative">
              <div className="flex justify-between items-center w-full cursor-pointer">
                {task.id === allowEdit ? (
                  <Input
                    className="w-[68%] absolute left-10"
                    value={updatedTodo.title || task.title}
                    onChange={(e) => {
                      setUpdatedTodo((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }));
                    }}
                  />
                ) : (
                  <span
                    onClick={() => toggleDescription(task.id)}
                    className="ml-6 text-white w-[75%]"
                  >
                    {task.status == "done" ? (
                      <s>{task.title}</s>
                    ) : (
                      <p>{task.title}</p>
                    )}
                  </span>
                )}

                {allowEdit === task.id ? (
                  <Checkbox
                    className="absolute left-3"
                    onChange={() => {
                      setUpdatedTodo((prev) => ({
                        ...prev,
                        status: "done",
                      }));
                    }}
                  />
                ) : task.status == "done" ? (
                  <div className="absolute left-3">✅</div>
                ) : (
                  <span
                    onMouseEnter={() => {
                      toast("Task In Progress");
                    }}
                    className="load absolute left-3"
                  ></span>
                )}

                {allowEdit === task.id ? (
                  <DatePicker
                    format="YYYY-MM-DD"
                    className="absolute w-[13.3%] right-[11%]"
                    allowClear
                    onChange={(date) => {
                      setUpdatedTodo({
                        ...updatedTodo,
                        dueDate: date?.toString(),
                      });
                    }}
                  />
                ) : (
                  <span className="text-white absolute right-20">
                    {task.dueDate}
                  </span>
                )}

                <div className="absolute right-12 rounded-md">
                  {allowEdit === task.id ? (
                    <div className="flex flex-col absolute">
                      <span
                        onClick={() => {
                          setEditPriority({
                            high: true,
                            medium: false,
                            low: false,
                          });
                          toast("PRIORITY HIGH");
                          setUpdatedTodo((prev) => ({
                            ...prev,
                            priority: "high",
                          }));
                        }}
                        className={`${
                          editPriority.high ? "opacity-[100%]" : "opacity-[50%]"
                        }`}
                      >
                        🔴
                      </span>
                      <span
                        onClick={() => {
                          setEditPriority({
                            high: false,
                            medium: true,
                            low: false,
                          });
                          toast("PRIORITY MEDIUM");
                          setUpdatedTodo((prev) => ({
                            ...prev,
                            priority: "medium",
                          }));
                        }}
                        className={`${
                          editPriority.medium
                            ? "opacity-[100%]"
                            : "opacity-[50%]"
                        }`}
                      >
                        🟢
                      </span>
                      <span
                        onClick={() => {
                          setEditPriority({
                            high: false,
                            medium: false,
                            low: true,
                          });
                          toast("PRIORITY LOW");
                          setUpdatedTodo((prev) => ({
                            ...prev,
                            priority: "low",
                          }));
                        }}
                        className={`${
                          editPriority.low ? "opacity-[100%]" : "opacity-[50%]"
                        }`}
                      >
                        🟡
                      </span>
                    </div>
                  ) : (
                    <div>
                      {task.priority === "high"
                        ? "🔴"
                        : task.priority === "medium"
                        ? "🟢"
                        : "🟡"}
                    </div>
                  )}
                </div>
                <Dropdown overlay={taskMenu(task.id)} trigger={["click"]}>
                  <MoreOutlined className="text-white text-lg ml-4" />
                </Dropdown>
              </div>
              {visibleTask === task.id && (
                <div className="ml-4 mt-2 text-gray-400">
                  <p>{task.description}</p>
                </div>
              )}
              {allowEdit === task.id && (
                <div className="w-[91%] flex relative ml-4 mt-5 right-[3.3%] text-gray-400">
                  <Input.TextArea
                    rows={2}
                    className=""
                    value={updatedTodo.description || task.description}
                    onChange={(e) => {
                      setUpdatedTodo((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }));
                    }}
                  />
                  <Button
                    onClick={() => {
                      handleTodoUpdation(task);
                      setAllowEdit(null);
                    }}
                    className="ml-6 mr-4 w-[18.6%] h-12 bg-black opacity-[80%] focus:bg-black text-white hover:bg-black"
                  >
                    Save Edits
                  </Button>
                </div>
              )}
            </List.Item>
          )}
        />
      ) : (
        <div className="w-[200px] mx-auto my-auto shadow-sm shadow-black h-[200px] flex flex-col justify-center items-center text-white rounded-lg bg-black opacity-[80%]">
          <img src="../../public/notes.png" alt="" className="w-[50%]" />
          <span className="font-bold">Focus on your day</span>
          <span className="text-sm">Get things done with ToDo</span>
        </div>
      )}
    </main>
  );
}
