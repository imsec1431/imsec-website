import express from "express";

import {
  submitAdmissionApplication,
  getAdmissionApplications,
  getAdmissionApplication,
  updateAdmissionApplicationStatus,
  deleteAdmissionApplication,
  exportAdmissionApplications,
} from "../controllers/admissionApplicationController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
   Submit Admission Application
========================================================= */

router.post("/public", submitAdmissionApplication);

/* =========================================================
   ADMIN — EXPORT APPLICATIONS
========================================================= */

router.get(
  "/admin/export",
  protect,
  requireGlobalPermission("admissions", "applications"),
  exportAdmissionApplications,
);

/* =========================================================
   ADMIN — GET ALL APPLICATIONS
========================================================= */

router.get(
  "/admin",
  protect,
  requireGlobalPermission("admissions", "applications"),
  getAdmissionApplications,
);

/* =========================================================
   ADMIN — GET SINGLE APPLICATION
========================================================= */

router.get(
  "/admin/:id",
  protect,
  requireGlobalPermission("admissions", "applications"),
  getAdmissionApplication,
);

/* =========================================================
   ADMIN — UPDATE STATUS
========================================================= */

router.patch(
  "/admin/:id/status",
  protect,
  requireGlobalPermission("admissions", "applications"),
  updateAdmissionApplicationStatus,
);

/* =========================================================
   ADMIN — DELETE
========================================================= */

router.delete(
  "/admin/:id",
  protect,
  requireGlobalPermission("admissions", "applications"),
  deleteAdmissionApplication,
);

export default router;
