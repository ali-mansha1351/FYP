import express from "express";
import { isAuthenticatedUser } from "../middlewares/authentication.js";
import {
  createPost,
  getPost,
  updatePost,
  getAllPost,
  deletePost,
} from "../controller/postController.js";

const router = express.Router();

router.route("/user/post").post(isAuthenticatedUser, createPost);
router.route("/user/post/all").get(isAuthenticatedUser, getAllPost);
router
  .route("/user/post/:id")
  .post(isAuthenticatedUser, updatePost)
  .get(isAuthenticatedUser, getPost)
  .delete(isAuthenticatedUser, deletePost);

export default router;
