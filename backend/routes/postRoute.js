import express from "express";
import { isAuthenticatedUser } from "../middlewares/authentication.js";
import {
  multerErrorMiddleware,
  multerFileFilter,
} from "../middlewares/errors.js";
import { uploadPostMedia } from "../middlewares/multer.js";
import {
  createPost,
  getPost,
  updatePost,
  getAllPost,
  deletePost,
} from "../controller/postController.js";

const router = express.Router();

router
  .route("/user/post")
  .post(
    isAuthenticatedUser,
    uploadPostMedia,
    multerErrorMiddleware,
    multerFileFilter,
    createPost
  );
router.route("/user/post/all").get(isAuthenticatedUser, getAllPost);
router
  .route("/user/post/:id")
  .post(
    isAuthenticatedUser,
    uploadPostMedia,
    multerErrorMiddleware,
    multerFileFilter,
    updatePost
  )
  .get(isAuthenticatedUser, getPost)
  .delete(isAuthenticatedUser, deletePost);

export default router;
