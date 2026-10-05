import express from "express";

import {
  getAllStudentHandbooks,
  getPublishedStudentHandbooks,
  getStudentHandbookById,
  createStudentHandbook,
  updateStudentHandbook,
  deleteStudentHandbook,
  toggleStudentHandbookStatus,
} from "../controllers/studentHandbookController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
   GET /api/student-handbooks
========================================================= */

router.get("/", getPublishedStudentHandbooks);

/* =========================================================
   ADMIN — GET ALL
   GET /api/student-handbooks/admin
========================================================= */

router.get(
  "/admin",
  protect,
  requireGlobalPermission("academics", "student-handbook"),
  getAllStudentHandbooks,
);

/* =========================================================
   ADMIN — GET SINGLE
   GET /api/student-handbooks/admin/:id
========================================================= */

router.get(
  "/admin/:id",
  protect,
  requireGlobalPermission("academics", "student-handbook"),
  getStudentHandbookById,
);

/* =========================================================
   ADMIN — CREATE
   POST /api/student-handbooks/admin
========================================================= */

router.post(
  "/admin",
  protect,
  requireGlobalPermission("academics", "student-handbook"),
  createStudentHandbook,
);

/* =========================================================
   ADMIN — UPDATE
   PUT /api/student-handbooks/admin/:id
========================================================= */

router.put(
  "/admin/:id",
  protect,
  requireGlobalPermission("academics", "student-handbook"),
  updateStudentHandbook,
);

/* =========================================================
   ADMIN — DELETE
   DELETE /api/student-handbooks/admin/:id
========================================================= */

router.delete(
  "/admin/:id",
  protect,
  requireGlobalPermission("academics", "student-handbook"),
  deleteStudentHandbook,
);

/* =========================================================
   ADMIN — PUBLISH / DRAFT
   PATCH /api/student-handbooks/admin/:id/status
========================================================= */

router.patch(
  "/admin/:id/status",
  protect,
  requireGlobalPermission("academics", "student-handbook"),
  toggleStudentHandbookStatus,
);

export default router;
