import express from "express";

import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import {
  getAlumniProfile,
  getAlumniProfileAdmin,
  updateAlumniProfile,
  resetAlumniProfile,
} from "../controllers/alumniProfileController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

// Existing Multer middleware
import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

// Get Alumni Profile for public website
router.get("/", getAlumniProfile);

/* =========================================================
   ADMIN / SUB ADMIN
   Permission:
   Alumni → Overview
========================================================= */

// Get complete Alumni Profile for admin
router.get(
  "/admin",
  protect,
  requireGlobalPermission("alumni", "overview"),
  getAlumniProfileAdmin,
);

// Update Alumni Profile
router.put(
  "/admin",
  protect,
  requireGlobalPermission("alumni", "overview"),
  upload.any(),
  validateUploadedFiles,
  updateAlumniProfile,
);

// Reset Alumni Profile
router.post(
  "/admin/reset-defaults",
  protect,
  requireGlobalPermission("alumni", "overview"),
  resetAlumniProfile,
);

export default router;
