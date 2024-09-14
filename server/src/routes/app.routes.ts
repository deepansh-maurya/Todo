import { Router } from "express";
import {
  deleteTodo,
  getTodo,
  isAuth,
  login,
  searchResult,
  signup,
  todo,
  updateTodo,
} from "../controller/app.controller";
import { authenticationMiddleware } from "../middleware/app.middlleware";
const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/todo").post(authenticationMiddleware, todo);
router.route("/auth-status").get(authenticationMiddleware, isAuth);
router.route("/get-todos").get(authenticationMiddleware, getTodo);
router.route("/update-todo").put(authenticationMiddleware, updateTodo);
router.route("/delete-todo").post(authenticationMiddleware, deleteTodo);
router.route("/search").post(authenticationMiddleware, searchResult);

export default router;
