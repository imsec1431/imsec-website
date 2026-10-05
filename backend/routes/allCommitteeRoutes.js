import express from "express";

import {
  getAllCommittees,
  getPublishedCommittees,
  getCommitteeById,
  createCommittee,
  updateCommittee,
  deleteCommittee,
} from "../controllers/allCommitteeController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC ROUTE
========================================================= */

// Get only published committees
router.get("/public", getPublishedCommittees);

/* =========================================================
   ADMIN / SUB ADMIN ROUTES
   Permission:
   Website Content → All Committees
========================================================= */

// Get all committees
router.get(
  "/",
  protect,
  requireGlobalPermission("website-content", "all-committees"),
  getAllCommittees,
);

// Get single committee
router.get(
  "/:id",
  protect,
  requireGlobalPermission("website-content", "all-committees"),
  getCommitteeById,
);

// Create committee
router.post(
  "/",
  protect,
  requireGlobalPermission("website-content", "all-committees"),
  createCommittee,
);

// Update committee
router.put(
  "/:id",
  protect,
  requireGlobalPermission("website-content", "all-committees"),
  updateCommittee,
);

// Delete committee
router.delete(
  "/:id",
  protect,
  requireGlobalPermission("website-content", "all-committees"),
  deleteCommittee,
);

export default router;
