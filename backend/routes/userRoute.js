import express from "express";
import { uploadProfileImages } from "../middlewares/profileImages.js";
import {
  getUsers,
  registerUser,
  getUserById,
  loginUser,
  logoutUser,
  deleteUser,
  resetPassword,
  forgotPassword,
  currentUser,
  updateUser,
  followUser,
  unFollowUser,
} from "../controller/userController.js";

import {
  isAuthenticatedUser,
  authorizeRoles,
} from "../middlewares/authentication.js";
const router = express.Router();

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUsers);

router.route("/user/newRegister").post(registerUser);

router.route("/user/login").post(loginUser);

router.route("/user/me").get(isAuthenticatedUser, currentUser);

router.route("/user/follow/:id").patch(isAuthenticatedUser, followUser);
router.route("/user/unfollow/:id").patch(isAuthenticatedUser, unFollowUser);

router.route("/user/password/forgot").post(forgotPassword);

router.route("/user/password/reset/:token").put(resetPassword);

router
  .route("/user/update")
  .put(isAuthenticatedUser, uploadProfileImages, updateUser);

router.route("/user/logout").get(logoutUser);

router
  .route("/admin/user/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

router.route("/user/:id").get(getUserById);

export default router;
