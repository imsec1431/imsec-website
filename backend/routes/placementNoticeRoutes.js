import express from "express";

import {
  getPublicPlacementNotices,
  getAdminPlacementNotices,
  createPlacementNotice,
  updatePlacementNotice,
  deletePlacementNotice,
} from "../controllers/placementNoticeController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

router.get("/", getPublicPlacementNotices);

/* =========================================================
   ADMIN - GET ALL
========================================================= */

router.get("/admin", protect,
  requireGlobalPermission("placements", "placement-notices"), getAdminPlacementNotices);

/* =========================================================
   ADMIN - CREATE
========================================================= */

router.post("/", protect,
  requireGlobalPermission("placements", "placement-notices"), createPlacementNotice);

/* =========================================================
   ADMIN - UPDATE
========================================================= */

router.put("/:id", protect,
  requireGlobalPermission("placements", "placement-notices"), updatePlacementNotice);

/* =========================================================
   ADMIN - DELETE
========================================================= */

router.delete("/:id", protect,
  requireGlobalPermission("placements", "placement-notices"), deletePlacementNotice);

export default router;
