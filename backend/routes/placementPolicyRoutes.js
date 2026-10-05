import express from "express";

import {
  createPlacementPolicy,
  getAllPlacementPolicies,
  getPublishedPlacementPolicies,
  getPlacementPolicyById,
  updatePlacementPolicy,
  deletePlacementPolicy,
  togglePlacementPolicyStatus,
} from "../controllers/placementPolicyController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

/*
   GET
   /api/placement-policies
*/

router.get("/", getPublishedPlacementPolicies);

/* =========================================================
   ADMIN - GET ALL
========================================================= */

/*
   GET
   /api/placement-policies/admin
*/

router.get("/admin", protect,
  requireGlobalPermission("placements", "placement-policy"), getAllPlacementPolicies);

/* =========================================================
   ADMIN - CREATE
========================================================= */

/*
   POST
   /api/placement-policies
*/

router.post("/", protect,
  requireGlobalPermission("placements", "placement-policy"), createPlacementPolicy);

/* =========================================================
   ADMIN - GET SINGLE
========================================================= */

/*
   GET
   /api/placement-policies/:id
*/

router.get("/:id", protect,
  requireGlobalPermission("placements", "placement-policy"), getPlacementPolicyById);

/* =========================================================
   ADMIN - UPDATE
========================================================= */

/*
   PUT
   /api/placement-policies/:id
*/

router.put("/:id", protect,
  requireGlobalPermission("placements", "placement-policy"), updatePlacementPolicy);

/* =========================================================
   ADMIN - DELETE
========================================================= */

/*
   DELETE
   /api/placement-policies/:id
*/

router.delete("/:id", protect,
  requireGlobalPermission("placements", "placement-policy"), deletePlacementPolicy);

/* =========================================================
   ADMIN - PUBLISH / DRAFT
========================================================= */

/*
   PATCH
   /api/placement-policies/:id/status
*/

router.patch("/:id/status", protect,
  requireGlobalPermission("placements", "placement-policy"), togglePlacementPolicyStatus);

export default router;
