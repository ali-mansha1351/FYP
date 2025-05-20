import express from "express";
import { isAuthenticatedUser } from "../middlewares/authentication.js";
import {
  createPattern,
  updatePattern,
  deletePattern,
  getPattern,
} from "../controller/patternController.js";

const router = express.Router();

router.route("/editor").post(isAuthenticatedUser, createPattern);
router
  .route("/editor/:id")
  .get(isAuthenticatedUser, getPattern)
  .post(isAuthenticatedUser, updatePattern)
  .delete(isAuthenticatedUser, deletePattern);

export default router;
