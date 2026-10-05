import express from "express";

import { protect } from "../middleware/authMiddleware.js";


import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import {
  createPlacementStat,
  getPlacementStats,
  getPlacementStatById,
  updatePlacementStat,
  deletePlacementStat,
} from "../controllers/placementStatController.js";

const router = express.Router();

// Create Placement Statistic
router.post(
  "/",
  protect,
  requireGlobalPermission("homepage", "placement-stats"), createPlacementStat);

// Get All Placement Statistics
router.get("/", getPlacementStats);

// Get Single Placement Statistic
router.get("/:id", getPlacementStatById);

// Update Placement Statistic
router.put(
  "/:id",
  protect,
  requireGlobalPermission("homepage", "placement-stats"), updatePlacementStat);

// Delete Placement Statistic
router.delete(
  "/:id",
  protect,
  requireGlobalPermission("homepage", "placement-stats"), deletePlacementStat);

export default router;
