import express from "express";
import { isAuthenticatedUser } from "../middlewares/authentication.js";
import { createPost, updatePost } from "../controller/postController.js";

const router = express.Router();

router.route("/user/post").post(isAuthenticatedUser, createPost);
router.route("/user/post/:id").post(isAuthenticatedUser, updatePost);

export default router;
