import { Input, Dropdown, Button, Menu } from "antd";
import { SaveOutlined, MoreOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import LoginScreen from "./AuthScreen";
import SignupScreen from "./SignupScreen";
import { RootState } from "../store/store";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useTodo } from "../hooks/AddTask";
import { setTasks } from "../store/taskSlice";
import { login } from "../store/authSlice";
import { sortTasksByDate, sortTasksByPriorityAndDate } from "../utils/utils";

export default function Header() {
  const dispatch = useDispatch();
  const tasksFromSlice = useSelector((state: RootState) => state.tasks.tasks);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [searchInput, setInputSearch] = useState("");
  const [signModalVisible, setSignModalVisible] = useState(false);
  const username = useSelector((state: RootState) => state.auth.user.username);
  const showLoginModal = () => setLoginModalVisible(true);
  const handleLoginModalClose = () => setLoginModalVisible(false);

  const showSIgnModal = () => setSignModalVisible(true);
  const handleSIgnModalClose = () => setSignModalVisible(false);

  const userMenu = (
    <Menu className="bg-gray-800">
      <Menu.Item key="1" onClick={showLoginModal}>
        Login
      </Menu.Item>
      <Menu.Item key="1" onClick={showSIgnModal}>
        Signup
      </Menu.Item>
    </Menu>
  );
  const authUserMenu = (
    <Menu className="bg-gray-800">
      <Menu.Item
        key="1"
        onClick={() => {
          localStorage.removeItem("token");
          dispatch(login({ username: "" }));
          window.location.reload();
        }}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  async function handleSearch() {
    console.log(searchInput);

    const response = await useTodo(
      `${import.meta.env.VITE_SERVER_URL}/api/v1/search`,
      "search",
      searchInput
    );
    const todos = response.todos;
    console.log(todos);

    dispatch(setTasks(todos));
  }
  function sortByDate() {
    const task = sortTasksByDate([...tasksFromSlice]);
    console.log(task);

    dispatch(setTasks(task));
  }

  function sortByPriority() {
    const task = sortTasksByPriorityAndDate([...tasksFromSlice]);
    console.log(task);

    dispatch(setTasks(task));
  }

  return (
    <header className="flex z-10 justify-evenly items-center gap-10 p-4 fixed top-0 w-[70%]">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-black md:text-5xl lg:text-6xl">
        To
        <span className="text-blue-600 dark:text-blue-500">Do</span>
      </h1>
      <div className="relative">
        <Input
          value={searchInput}
          onChange={(e) => {
            setInputSearch(e.target.value);
          }}
          placeholder="Search tasks"
          className="mx-4 pl-5 w-[400px] h-[44px] bg-black text-white hover:bg-gray-900 placeholder-white focus:bg-black focus:outline-none opacity-[70%] hover:outline-none focus:ring-0"
        />
        <Button
          onClick={() => {
            handleSearch();
          }}
          className=" bg-black absolute  h-[42px] text-white hover:bg-gray-900 placeholder-white focus:bg-black focus:outline-none opacity-[70%] hover:outline-none focus:ring-0  right-3"
        >
          <FaSearch />
        </Button>
      </div>
      <Dropdown
        overlay={username ? authUserMenu : userMenu}
        className="bg-gray-900 opacity-[70%] h-[43px] hover:bg-gray-900"
      >
        <Button
          icon={username ? <UserOutlined /> : <SaveOutlined />}
          className="text-white bg-gray-700 opacity-[80%] focus:bg-gray-700 hover:bg-gray-700"
        >
          {username ? username : "Persist Your Task"}
        </Button>
      </Dropdown>
      <Dropdown
        overlay={
          <Menu className="bg-none">
            <Menu.Item key="1">Sort By</Menu.Item>
            <Menu.Item key="2" onClick={sortByDate}>
              Due Date
            </Menu.Item>
            <Menu.Item
              onClick={sortByPriority}
              key="3"
              className="hover:font-bold"
            >
              Priority
            </Menu.Item>
          </Menu>
        }
      >
        <MoreOutlined className="ml-4 text-black text-4xl" />
      </Dropdown>

      <LoginScreen
        visible={loginModalVisible}
        onClose={handleLoginModalClose}
      />
      <SignupScreen visible={signModalVisible} onClose={handleSIgnModalClose} />
    </header>
  );
}
