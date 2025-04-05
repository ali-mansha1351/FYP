import express from "express";
import { isAuthenticatedUser } from "../middlewares/authentication.js";
import { createPattern } from "../controller/patternController.js";

const router = express.Router();

router.route("/editor").post(isAuthenticatedUser, createPattern);

export default router;
