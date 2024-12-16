import express from "express";
import {
  getUsers,
  registerUser,
  getUserById,
  loginUser,
  logoutUser,
  deleteUser,
} from "../controller/userController.js";

import { isAuthenticatedUser } from "../middlewares/authentication.js";
const router = express.Router();

router.route("/users").get(isAuthenticatedUser, getUsers);

router.route("/user/newRegister").post(registerUser);

router.route("/user/login").post(loginUser);

router.route("/user/logout").get(logoutUser);

router.route("/user/delete/:id").delete(isAuthenticatedUser, deleteUser);

router.route("/user/:id").get(getUserById);

export default router;
