import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import {
  getStudentClubs,
  getStudentClubsAdmin,
  updateStudentClubs,
  deleteStudentClub,
  resetStudentClubsDefaults,
} from "../controllers/studentClubController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

/*
 * GET
 * /api/student-clubs
 */
router.get("/", getStudentClubs);

/* =========================================================
   ADMIN
========================================================= */

/*
 * GET
 * /api/student-clubs/admin
 */
router.get("/admin", protect,
  requireGlobalPermission("life-imsec", "students-clubs"), getStudentClubsAdmin);

/*
 * UPDATE
 *
 * PUT
 * /api/student-clubs/admin
 *
 * Existing Multer middleware is used.
 */
router.put("/admin", protect,
  requireGlobalPermission("life-imsec", "students-clubs"), upload.any(),
  validateUploadedFiles, updateStudentClubs);

/*
 * DELETE ONE CLUB
 *
 * DELETE
 * /api/student-clubs/admin/:clubId
 */
router.delete("/admin/:clubId", protect,
  requireGlobalPermission("life-imsec", "students-clubs"), deleteStudentClub);

/*
 * RESET
 *
 * POST
 * /api/student-clubs/admin/reset-defaults
 */
router.post("/admin/reset-defaults", protect,
  requireGlobalPermission("life-imsec", "students-clubs"), resetStudentClubsDefaults);

export default router;
