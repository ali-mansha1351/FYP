import express from "express";
import {
  getUsers,
  registerUser,
  getUserById,
} from "../controller/userController.js";

const router = express.Router();

router.route("/users").get(getUsers);

router.route("/user/new").post(registerUser);

router.route("/user/:id").get(getUserById);

export default router;
