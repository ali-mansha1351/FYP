import express from "express";
import { isAuthenticatedUser } from "../middlewares/authentication.js";
import {
  createPattern,
  getPatternById,
  getPatterns,
  // updatePattern,
  // deletePattern,
  // getPattern,
} from "../controller/patternController.js";

const router = express.Router();

// POST /api/v1/patterns → Create new pattern
router.post("/patterns", isAuthenticatedUser, createPattern);

// GET /api/v1/patterns → Get all patterns for the authenticated user
router.get("/patterns", isAuthenticatedUser, getPatterns);

// GET /api/v1/patterns/:id → Get a single pattern by ID
router.get("/patterns/:id", isAuthenticatedUser, getPatternById);

// GET /api/v1/patterns/:id → Get pattern by ID
// PUT /api/v1/patterns/:id → Update pattern
// DELETE /api/v1/patterns/:id → Delete pattern
// router
//   .route("/patterns/:id")
//   .get(isAuthenticatedUser, getPattern)
//   .put(isAuthenticatedUser, updatePattern)
//   .delete(isAuthenticatedUser, deletePattern);

export default router;
