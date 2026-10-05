import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import upload from "../middleware/multerMiddleware.js";

import {
  addProgram,
  getPrograms,
  getProgram,
  updateProgram,
  deleteProgram,
} from "../controllers/academicDevelopmentProgramController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

/*
 * Get all Academic Development Programs
 *
 * Public website
 */
router.get("/", getPrograms);

/*
 * Get single Academic Development Program
 *
 * Public website
 */
router.get("/:id", getProgram);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN ROUTES
|--------------------------------------------------------------------------
|
| Permission:
| Academics → Academic Development Program
|
| Key:
| academics → academic-development-program
|
|--------------------------------------------------------------------------
*/

/*
 * Add Academic Development Program
 *
 * Protected with JWT authentication and
 * Academic Development Program permission.
 *
 * Image upload is retained.
 */
router.post(
  "/",
  protect,
  requireGlobalPermission("academics", "academic-development-program"),
  upload.single("image"),
  validateUploadedFiles,
  addProgram,
);

/*
 * Update Academic Development Program
 *
 * Protected with JWT authentication and
 * Academic Development Program permission.
 *
 * Image upload is retained.
 */
router.put(
  "/:id",
  protect,
  requireGlobalPermission("academics", "academic-development-program"),
  upload.single("image"),
  validateUploadedFiles,
  updateProgram,
);

/*
 * Delete Academic Development Program
 *
 * Protected with JWT authentication and
 * Academic Development Program permission.
 */
router.delete(
  "/:id",
  protect,
  requireGlobalPermission("academics", "academic-development-program"),
  deleteProgram,
);

export default router;
