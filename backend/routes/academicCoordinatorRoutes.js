import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import {
  createAcademicCoordinator,
  getAcademicCoordinators,
  getPublishedAcademicCoordinators,
  getAcademicCoordinator,
  updateAcademicCoordinator,
  deleteAcademicCoordinator,
} from "../controllers/academicCoordinatorController.js";

import upload from "../middleware/multerMiddleware.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
| These routes are used by the public college website.
|--------------------------------------------------------------------------
*/

/*
 * Get published Academic Coordinators
 */
router.get("/published", getPublishedAcademicCoordinators);

/*
 * Get single Academic Coordinator
 *
 * Public because this can be used by the website.
 */
router.get("/:id", getAcademicCoordinator);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN ROUTES
|--------------------------------------------------------------------------
| Permission:
| Academics → Academic Coordinator
|
| Permission key:
| academics → academic-coordinator
|--------------------------------------------------------------------------
*/

/*
 * Get all Academic Coordinators
 *
 * Admin / Sub Admin only.
 */
router.get(
  "/",
  protect,
  requireGlobalPermission("academics", "academic-coordinator"),
  getAcademicCoordinators,
);

/*
 * Create Academic Coordinator
 *
 * Admin / Sub Admin only.
 * Image upload is retained.
 */
router.post(
  "/",
  protect,
  requireGlobalPermission("academics", "academic-coordinator"),
  upload.single("image"),
  validateUploadedFiles,
  createAcademicCoordinator,
);

/*
 * Update Academic Coordinator
 *
 * Admin / Sub Admin only.
 * Image upload remains optional.
 */
router.put(
  "/:id",
  protect,
  requireGlobalPermission("academics", "academic-coordinator"),
  upload.single("image"),
  validateUploadedFiles,
  updateAcademicCoordinator,
);

/*
 * Delete Academic Coordinator
 *
 * Admin / Sub Admin only.
 */
router.delete(
  "/:id",
  protect,
  requireGlobalPermission("academics", "academic-coordinator"),
  deleteAcademicCoordinator,
);

export default router;
