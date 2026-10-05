import express from "express";

import { protect } from "../middleware/authMiddleware.js";


import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import {
  addStatistic,
  getStatistics,
  getStatistic,
  updateStatistic,
  deleteStatistic,
} from "../controllers/libraryStatisticController.js";

const router = express.Router();

// ======================================
// Get All
// ======================================

router.get("/", getStatistics);

// ======================================
// Get Single
// ======================================

router.get("/:id", getStatistic);

// ======================================
// Add
// ======================================

router.post(
  "/",
  protect,
  requireGlobalPermission("library", "statistics"), addStatistic);

// ======================================
// Update
// ======================================

router.put(
  "/:id",
  protect,
  requireGlobalPermission("library", "statistics"), updateStatistic);

// ======================================
// Delete
// ======================================

router.delete(
  "/:id",
  protect,
  requireGlobalPermission("library", "statistics"), deleteStatistic);

export default router;
