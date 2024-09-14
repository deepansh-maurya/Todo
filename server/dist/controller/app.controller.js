"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchResult = exports.deleteTodo = exports.updateTodo = exports.getTodo = exports.isAuth = exports.todo = exports.login = exports.signup = void 0;
const todo_model_1 = require("../models/todo.model");
const user_model_1 = require("../models/user.model");
const app_utils_1 = require("../utils/app.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generator = (0, app_utils_1.createUniqueNumberGenerator)();
let signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "credentials are empty",
            });
        }
        const isUserAvailable = yield user_model_1.User.findOne({
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
        const newUser = yield user_model_1.User.create({
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Signup failed",
        });
    }
});
exports.signup = signup;
let login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { identity, password } = req.body;
        if (!identity || !password) {
            return res.status(400).json({
                success: false,
                message: "credentials are empty",
            });
        }
        const isUserAvailable = yield user_model_1.User.findOne({
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
        if (secretKey)
            token = jsonwebtoken_1.default.sign(userData, secretKey, { header, expiresIn });
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "login failed",
        });
    }
});
exports.login = login;
let todo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, priority, dueDate, status } = req.body;
        if (!title || !dueDate) {
            return res.status(400).json({
                success: false,
                message: "credentials are empty",
            });
        }
        const newTodo = yield todo_model_1.Todo.create({
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
        const user = yield user_model_1.User.findById(req.user._id);
        const userTodos = user === null || user === void 0 ? void 0 : user.todos;
        if (userTodos)
            userTodos.push(newTodo._id);
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(req.user._id, {
            todos: userTodos,
        }, { new: true });
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed to add todo",
        });
    }
});
exports.todo = todo;
let isAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(req.user._id);
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
    }
    catch (error) { }
});
exports.isAuth = isAuth;
let getTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found",
            });
        }
        const todoIds = user === null || user === void 0 ? void 0 : user.todos;
        const todos = yield Promise.all((todoIds === null || todoIds === void 0 ? void 0 : todoIds.map((todoId) => __awaiter(void 0, void 0, void 0, function* () {
            const todo = yield todo_model_1.Todo.findById(todoId, "title description priority due_date status");
            return {
                title: todo === null || todo === void 0 ? void 0 : todo.title,
                description: todo === null || todo === void 0 ? void 0 : todo.description,
                priority: todo === null || todo === void 0 ? void 0 : todo.priority,
                status: todo === null || todo === void 0 ? void 0 : todo.status,
                id: todo === null || todo === void 0 ? void 0 : todo._id,
                dueDate: todo === null || todo === void 0 ? void 0 : todo.due_date,
            };
        }))) || []);
        return res.status(200).json({
            success: true,
            message: "todos fetched successfully",
            todos,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "error while fetching todos",
        });
    }
});
exports.getTodo = getTodo;
let updateTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const todo = yield todo_model_1.Todo.findById(id);
        const updateTodo = yield todo_model_1.Todo.findByIdAndUpdate(id, {
            title: req.body.title || (todo === null || todo === void 0 ? void 0 : todo.title),
            description: req.body.description || (todo === null || todo === void 0 ? void 0 : todo.description),
            priority: req.body.priority || (todo === null || todo === void 0 ? void 0 : todo.priority),
            due_date: req.body.dueDate || (todo === null || todo === void 0 ? void 0 : todo.due_date),
            status: req.body.status || (todo === null || todo === void 0 ? void 0 : todo.status),
        }, { new: true });
        if (!updateTodo) {
            return res
                .status(500)
                .json({ success: false, message: "todo updation failed" });
        }
        return res
            .status(200)
            .json({ success: true, message: "todo updated", updateTodo });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "todo updation failed" });
    }
});
exports.updateTodo = updateTodo;
let deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const updatedttodo = yield todo_model_1.Todo.findByIdAndDelete(id);
        if (!updatedttodo) {
            return res
                .status(500)
                .json({ success: false, message: "todo deletion failed" });
        }
        const user = yield user_model_1.User.findById(req.user._id);
        const todos = user === null || user === void 0 ? void 0 : user.todos;
        let updatedTodos;
        if (todos)
            updatedTodos = todos.filter((todo) => todo._id.toString() !== id);
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(req.user._id, {
            todos: updatedTodos,
        }, { new: true });
        const newtodos = yield Promise.all((updatedTodos === null || updatedTodos === void 0 ? void 0 : updatedTodos.map((todoId) => __awaiter(void 0, void 0, void 0, function* () {
            const todo = yield todo_model_1.Todo.findById(todoId, "title description priority due_date status");
            return {
                title: todo === null || todo === void 0 ? void 0 : todo.title,
                description: todo === null || todo === void 0 ? void 0 : todo.description,
                priority: todo === null || todo === void 0 ? void 0 : todo.priority,
                status: todo === null || todo === void 0 ? void 0 : todo.status,
                id: todo === null || todo === void 0 ? void 0 : todo._id,
                dueDate: todo === null || todo === void 0 ? void 0 : todo.due_date,
            };
        }))) || []);
        return res.status(200).json({
            success: true,
            message: "todo deleted",
            todos: newtodos,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: true,
            message: "todo deletion failed",
        });
    }
});
exports.deleteTodo = deleteTodo;
const searchResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.body;
        const user = yield user_model_1.User.findById(req.user._id).populate("todos");
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        const todoIds = user.todos.map((todo) => todo._id);
        const todos = yield todo_model_1.Todo.find({
            _id: { $in: todoIds },
            title: { $regex: search, $options: "i" },
        }, "title description priority due_date status _id");
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
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Error occurred during search" });
    }
});
exports.searchResult = searchResult;
