import express from "express";

import { protect } from "../middleware/authMiddleware.js";


import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import {
  createPlacementHighlight,
  getPlacementHighlights,
  getPlacementHighlightById,
  updatePlacementHighlight,
  deletePlacementHighlight,
  getPublicPlacementHighlights,
} from "../controllers/placementHighlightController.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

router.get("/public", getPublicPlacementHighlights);

/* =========================================================
   ADMIN / ALL
========================================================= */

router.get("/", getPlacementHighlights);

router.post(
  "/",
  protect,
  requireGlobalPermission("homepage", "placements"), createPlacementHighlight);

router.get("/:id", getPlacementHighlightById);

router.put(
  "/:id",
  protect,
  requireGlobalPermission("homepage", "placements"), updatePlacementHighlight);

router.delete(
  "/:id",
  protect,
  requireGlobalPermission("homepage", "placements"), deletePlacementHighlight);

export default router;
