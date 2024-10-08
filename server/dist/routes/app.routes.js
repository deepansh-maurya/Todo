"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const app_controller_1 = require("../controller/app.controller");
const app_middlleware_1 = require("../middleware/app.middlleware");
const router = (0, express_1.Router)();
router.route("/signup").post(app_controller_1.signup);
router.route("/login").post(app_controller_1.login);
router.route("/todo").post(app_middlleware_1.authenticationMiddleware, app_controller_1.todo);
router.route("/auth-status").get(app_middlleware_1.authenticationMiddleware, app_controller_1.isAuth);
router.route("/get-todos").get(app_middlleware_1.authenticationMiddleware, app_controller_1.getTodo);
router.route("/update-todo").put(app_middlleware_1.authenticationMiddleware, app_controller_1.updateTodo);
router.route("/delete-todo").post(app_middlleware_1.authenticationMiddleware, app_controller_1.deleteTodo);
router.route("/search").post(app_middlleware_1.authenticationMiddleware, app_controller_1.searchResult);
exports.default = router;
