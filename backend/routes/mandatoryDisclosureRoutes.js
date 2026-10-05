import express from "express";

import {
  getPublicMandatoryDisclosure,
  getAdminMandatoryDisclosure,
  createMandatoryDisclosure,
  updateMandatoryDisclosure,
  publishMandatoryDisclosure,
  unpublishMandatoryDisclosure,
  deleteMandatoryDisclosure,
} from "../controllers/mandatoryDisclosureController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

// Get published Mandatory Disclosure
router.get("/", getPublicMandatoryDisclosure);

/* =========================================================
   ADMIN / SUB ADMIN
   Permission:
   Website Content → Mandatory Disclosure
========================================================= */

// Get all Mandatory Disclosure entries
router.get(
  "/admin",
  protect,
  requireGlobalPermission("website-content", "mandatory-disclosure"),
  getAdminMandatoryDisclosure,
);

// Create Mandatory Disclosure
router.post(
  "/admin",
  protect,
  requireGlobalPermission("website-content", "mandatory-disclosure"),
  createMandatoryDisclosure,
);

// Update Mandatory Disclosure
router.put(
  "/admin/:id",
  protect,
  requireGlobalPermission("website-content", "mandatory-disclosure"),
  updateMandatoryDisclosure,
);

// Publish Mandatory Disclosure
router.patch(
  "/admin/:id/publish",
  protect,
  requireGlobalPermission("website-content", "mandatory-disclosure"),
  publishMandatoryDisclosure,
);

// Unpublish Mandatory Disclosure
router.patch(
  "/admin/:id/unpublish",
  protect,
  requireGlobalPermission("website-content", "mandatory-disclosure"),
  unpublishMandatoryDisclosure,
);

// Delete Mandatory Disclosure
router.delete(
  "/admin/:id",
  protect,
  requireGlobalPermission("website-content", "mandatory-disclosure"),
  deleteMandatoryDisclosure,
);

export default router;
