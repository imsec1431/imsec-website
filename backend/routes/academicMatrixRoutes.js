import express from "express";

import {
  getPublicAcademicMatrix,
  getAdminAcademicMatrix,
  createAcademicMatrix,
  updateAcademicMatrix,
  publishAcademicMatrix,
  unpublishAcademicMatrix,
  deleteAcademicMatrix,
} from "../controllers/academicMatrixController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

/*
 * Get all published Academic Matrix records.
 *
 * Public website requires this information,
 * therefore this route remains public.
 */
router.get("/", getPublicAcademicMatrix);

/* =========================================================
   ADMIN / SUB ADMIN
========================================================= */

/*
 * Get all Academic Matrix records for administration.
 *
 * Permission:
 * Homepage → Academic Matrix
 */
router.get(
  "/admin",
  protect,
  requireGlobalPermission("homepage", "academic-matrix"),
  getAdminAcademicMatrix,
);

/*
 * Create Academic Matrix record.
 *
 * Permission:
 * Homepage → Academic Matrix
 */
router.post(
  "/admin",
  protect,
  requireGlobalPermission("homepage", "academic-matrix"),
  createAcademicMatrix,
);

/*
 * Update Academic Matrix record.
 *
 * Permission:
 * Homepage → Academic Matrix
 */
router.put(
  "/admin/:id",
  protect,
  requireGlobalPermission("homepage", "academic-matrix"),
  updateAcademicMatrix,
);

/*
 * Publish Academic Matrix record.
 *
 * Permission:
 * Homepage → Academic Matrix
 */
router.patch(
  "/admin/:id/publish",
  protect,
  requireGlobalPermission("homepage", "academic-matrix"),
  publishAcademicMatrix,
);

/*
 * Unpublish Academic Matrix record.
 *
 * Permission:
 * Homepage → Academic Matrix
 */
router.patch(
  "/admin/:id/unpublish",
  protect,
  requireGlobalPermission("homepage", "academic-matrix"),
  unpublishAcademicMatrix,
);

/*
 * Delete Academic Matrix record.
 *
 * Permission:
 * Homepage → Academic Matrix
 */
router.delete(
  "/admin/:id",
  protect,
  requireGlobalPermission("homepage", "academic-matrix"),
  deleteAcademicMatrix,
);

export default router;
