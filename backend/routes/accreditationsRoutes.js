import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import {
  getAccreditations,
  getAccreditationsAdmin,
  updateAccreditations,
  uploadAccreditationPhoto,
  deleteAccreditationPhoto,
  resetAccreditations,
} from "../controllers/AccreditationsController.js";

import { protect } from "../middleware/authMiddleware.js";

import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
   ========================================================= */

/*
 * Get public accreditation information
 *
 * GET /api/accreditations
 */
router.get("/", getAccreditations);

/* =========================================================
   ADMIN — GET
   ========================================================= */

/*
 * Get accreditation data for Admin Panel
 *
 * GET /api/accreditations/admin
 *
 * Permission:
 * Accreditations → Accreditations
 */
router.get(
  "/admin",
  protect,
  requireGlobalPermission("accreditations", "accreditations"),
  getAccreditationsAdmin,
);

/* =========================================================
   ADMIN — UPDATE
   ========================================================= */

/*
 * Update accreditation information
 *
 * PUT /api/accreditations/admin
 *
 * Permission:
 * Accreditations → Accreditations
 */
router.put(
  "/admin",
  protect,
  requireGlobalPermission("accreditations", "accreditations"),
  updateAccreditations,
);

/* =========================================================
   ADMIN — UPLOAD PHOTO
   ========================================================= */

/*
 * Upload accreditation photo
 *
 * POST /api/accreditations/admin/upload-photo
 *
 * Permission:
 * Accreditations → Accreditations
 */
router.post(
  "/admin/upload-photo",
  protect,
  requireGlobalPermission("accreditations", "accreditations"),
  upload.single("photo"),
  validateUploadedFiles,
  uploadAccreditationPhoto,
);

/* =========================================================
   ADMIN — DELETE PHOTO
   ========================================================= */

/*
 * Delete accreditation photo
 *
 * DELETE /api/accreditations/admin/delete-photo
 *
 * Permission:
 * Accreditations → Accreditations
 */
router.delete(
  "/admin/delete-photo",
  protect,
  requireGlobalPermission("accreditations", "accreditations"),
  deleteAccreditationPhoto,
);

/* =========================================================
   ADMIN — RESET DEFAULTS
   ========================================================= */

/*
 * Reset accreditation information
 *
 * POST /api/accreditations/admin/reset-defaults
 *
 * Permission:
 * Accreditations → Accreditations
 */
router.post(
  "/admin/reset-defaults",
  protect,
  requireGlobalPermission("accreditations", "accreditations"),
  resetAccreditations,
);

export default router;
