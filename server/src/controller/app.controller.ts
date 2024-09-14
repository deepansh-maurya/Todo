import { Todo } from "../models/todo.model";
import { User } from "../models/user.model";
import { createUniqueNumberGenerator } from "../utils/app.utils";
import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
const generator = createUniqueNumberGenerator();

export let signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "credentials are empty",
      });
    }

    const isUserAvailable = await User.findOne({
      email,
    });

    if (isUserAvailable) {
      return res.status(409).json({
        success: false,
        message: "User already signed up",
      });
    }
    const namePart = email.split("@");
    const number = generator.generate().toString();

    const username = `${namePart[0]}_${number}`;

    const newUser = await User.create({
      email,
      username,
      password: password,
    });

    if (!newUser) {
      return res.status(500).json({
        success: false,
        message: "Signup failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Signed up successfully",
      user: { username: newUser.username },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
};
export let login = async (req: Request, res: Response) => {
  try {
    const { identity, password } = req.body;

    if (!identity || !password) {
      return res.status(400).json({
        success: false,
        message: "credentials are empty",
      });
    }

    const isUserAvailable = await User.findOne({
      $or: [{ username: identity }, { email: identity }],
    });

    if (!isUserAvailable) {
      return res.status(409).json({
        success: false,
        message: "User not available",
      });
    }

    const isPasswordMatched = password == isUserAvailable.password;

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "wrong password",
      });
    }
    const header = {
      alg: "HS256",
      typ: "JWT",
    };
    const expiresIn = "10d";
    const userData = {
      id: isUserAvailable._id,
      username: identity,
    };
    const secretKey = process.env.JWT_SECRET_KEY;
    let token;
    if (secretKey) token = jwt.sign(userData, secretKey, { header, expiresIn });
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res.status(200).cookie("token", token, options).json({
      success: true,
      message: "you are logged in",
      token,
      username: isUserAvailable.username,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "login failed",
    });
  }
};
export let todo = async (req: Request, res: Response) => {
  try {
    const { title, description, priority, dueDate, status } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "credentials are empty",
      });
    }
    const newTodo = await Todo.create({
      title,
      description: description || null,
      priority: priority || null,
      due_date: dueDate,
      status: status || null,
    });

    if (!newTodo) {
      return res.status(500).json({
        success: false,
        message: "failed to create todo",
      });
    }

    const user = await User.findById(req.user._id);

    const userTodos = user?.todos;

    if (userTodos) userTodos.push(newTodo._id);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        todos: userTodos,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: "failed to add todo",
      });
    }

    return res.status(200).json({
      success: true,
      message: "todo added successfully",
      todo: newTodo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "failed to add todo",
    });
  }
};

export let isAuth = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "user found",
      username: user.username,
    });
  } catch (error) {}
};
export let getTodo = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    const todoIds = user?.todos;

    const todos = await Promise.all(
      todoIds?.map(async (todoId) => {
        const todo = await Todo.findById(
          todoId,
          "title description priority due_date status"
        );
        return {
          title: todo?.title,
          description: todo?.description,
          priority: todo?.priority,
          status: todo?.status,
          id: todo?._id,
          dueDate: todo?.due_date,
        };
      }) || []
    );

    return res.status(200).json({
      success: true,
      message: "todos fetched successfully",
      todos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error while fetching todos",
    });
  }
};
export let updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    const todo = await Todo.findById(id);

    const updateTodo = await Todo.findByIdAndUpdate(
      id,
      {
        title: req.body.title || todo?.title,
        description: req.body.description || todo?.description,
        priority: req.body.priority || todo?.priority,
        due_date: req.body.dueDate || todo?.due_date,
        status: req.body.status || todo?.status,
      },
      { new: true }
    );

    if (!updateTodo) {
      return res
        .status(500)
        .json({ success: false, message: "todo updation failed" });
    }
    return res
      .status(200)
      .json({ success: true, message: "todo updated", updateTodo });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "todo updation failed" });
  }
};

export let deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    const updatedttodo = await Todo.findByIdAndDelete(id);

    if (!updatedttodo) {
      return res
        .status(500)
        .json({ success: false, message: "todo deletion failed" });
    }

    const user = await User.findById(req.user._id);

    const todos = user?.todos;

    let updatedTodos;
    if (todos)
      updatedTodos = todos.filter((todo) => todo._id.toString() !== id);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        todos: updatedTodos,
      },
      { new: true }
    );

    const newtodos = await Promise.all(
      updatedTodos?.map(async (todoId) => {
        const todo = await Todo.findById(
          todoId,
          "title description priority due_date status"
        );
        return {
          title: todo?.title,
          description: todo?.description,
          priority: todo?.priority,
          status: todo?.status,
          id: todo?._id,
          dueDate: todo?.due_date,
        };
      }) || []
    );
    return res.status(200).json({
      success: true,
      message: "todo deleted",
      todos: newtodos,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: "todo deletion failed",
    });
  }
};
export const searchResult = async (req: Request, res: Response) => {
  try {
    const { search } = req.body;
    const user = await User.findById(req.user._id).populate("todos");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const todoIds = user.todos.map((todo) => todo._id);

    const todos = await Todo.find(
      {
        _id: { $in: todoIds },
        title: { $regex: search, $options: "i" },
      },
      "title description priority due_date status _id"
    );
    const transformedTodos = todos.map((todo) => ({
      id: todo._id,
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      dueDate: todo.due_date,
      status: todo.status,
    }));
    if (todos.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No results found" });
    }

    return res.status(200).json({ success: true, todos: transformedTodos });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error occurred during search" });
  }
};
