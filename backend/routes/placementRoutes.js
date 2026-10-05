import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import { protect } from "../middleware/authMiddleware.js";


import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

import {
  createPlacement,
  getPlacements,
  getPlacementById,
  updatePlacement,
  deletePlacement,
} from "../controllers/placementController.js";

const router = express.Router();

// Create Placement
router.post(
  "/",
  protect,
  requireGlobalPermission("placements", "overview"), upload.single("image"),
  validateUploadedFiles, createPlacement);

// Get All Placements
router.get("/", getPlacements);

// Get Single Placement
router.get("/:id", getPlacementById);

// Update Placement
router.put(
  "/:id",
  protect,
  requireGlobalPermission("placements", "overview"), upload.single("image"),
  validateUploadedFiles, updatePlacement);

// Delete Placement
router.delete(
  "/:id",
  protect,
  requireGlobalPermission("placements", "overview"), deletePlacement);

export default router;
