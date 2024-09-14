import React, { useEffect, useState } from "react";
import { Button } from "antd";
import Lists from "./components/Lists";
import TaskForm from "./components/TaskForm";
import Header from "./components/Header";
import { useAuth } from "./hooks/AuthHookes";
import { useDispatch } from "react-redux";
import { login } from "./store/authSlice";
import { useTodo } from "./hooks/AddTask";
import { setTasks } from "./store/taskSlice";
interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  dueDate: string | null;
  status: string;
}

const images = [
  "./image.png",
  "./image2.png",
  "./image3.png",
  "./image4.png",
  "./image5.png",
  "./image6.png",
  "./image8.png",
  "./image9.png",
  "./image10.png",
  "./image11.png",
  "./image12.png",
  "./image13.png",
];

const App: React.FC = () => {
  const [random, setRandom] = useState(4);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const dispatch = useDispatch();

  const fetchTodos = async () => {
    const response = await useTodo(
      `${import.meta.env.VITE_SERVER_URL}/api/v1/get-todos`,
      "gettodos",
      null
    );
    const todos = response.todos;
    dispatch(setTasks(todos));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  async function checkAuth() {
    const response = await useAuth(
      `${import.meta.env.VITE_SERVER_URL}/api/v1/auth-status`,
      "authcheck",
      null
    );
    dispatch(login({ username: response.username }));
  }

  useEffect(() => {
    checkAuth();
  }, []);

  const handleFormSubmit = (values: any) => {
    console.log("Task values:", values);
    setIsFormVisible(false);
  };

  const backgroundImage = {
    backgroundImage: `url(${images[random]})`,
  };

  return (
    <div
      className="min-h-screen overflow-hidden flex flex-col bg-center bg-cover text-black opacity-[90%] justify-center items-center"
      style={backgroundImage}
    >
      <Header />
      <Lists />
      <footer className="p-4 z-30 flex justify-center fixed bottom-0 w-[100%]">
        <span
          onClick={() => {
            setRandom(Math.floor(Math.random() * 12));
          }}
          className="loader"
        ></span>
        <Button
          onClick={() => setIsFormVisible(true)}
          className="ml-6 mr-4 h-12 w-[68%] bg-black opacity-[80%] focus:bg-black text-white hover:bg-black"
        >
          Add New Task
        </Button>
        {isFormVisible && (
          <TaskForm
            visible={isFormVisible}
            onSubmit={(values: Task) => {
              handleFormSubmit(values);
            }}
            onCancel={() => setIsFormVisible(false)}
          />
        )}
      </footer>
    </div>
  );
};

export default App;
