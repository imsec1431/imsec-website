import express from "express";

import {
  getPublicAdmissionProcess,
  getAdminAdmissionProcess,
  createAdmissionProcess,
  updateAdmissionProcess,
  publishAdmissionProcess,
  unpublishAdmissionProcess,
  resetAdmissionProcess,
} from "../controllers/admissionProcessController.js";

import { protect } from "../middleware/authMiddleware.js";

import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
   =========================================================
   
   GET /api/admission-process/public
   
   No authentication required.
   ========================================================= */

router.get("/public", getPublicAdmissionProcess);

/* =========================================================
   ADMIN — GET
   =========================================================
   
   GET /api/admission-process/admin
   
   Permission:
   Admissions → Admissions Process
   ========================================================= */

router.get(
  "/admin",
  protect,
  requireGlobalPermission("admissions", "admissions-process"),
  getAdminAdmissionProcess,
);

/* =========================================================
   ADMIN — CREATE / INITIALIZE
   =========================================================
   
   POST /api/admission-process/admin
   
   Permission:
   Admissions → Admissions Process
   ========================================================= */

router.post(
  "/admin",
  protect,
  requireGlobalPermission("admissions", "admissions-process"),
  createAdmissionProcess,
);

/* =========================================================
   ADMIN — UPDATE
   =========================================================
   
   PUT /api/admission-process/admin
   
   Permission:
   Admissions → Admissions Process
   ========================================================= */

router.put(
  "/admin",
  protect,
  requireGlobalPermission("admissions", "admissions-process"),
  updateAdmissionProcess,
);

/* =========================================================
   ADMIN — PUBLISH
   =========================================================
   
   PATCH /api/admission-process/admin/publish
   
   Permission:
   Admissions → Admissions Process
   ========================================================= */

router.patch(
  "/admin/publish",
  protect,
  requireGlobalPermission("admissions", "admissions-process"),
  publishAdmissionProcess,
);

/* =========================================================
   ADMIN — UNPUBLISH
   =========================================================
   
   PATCH /api/admission-process/admin/unpublish
   
   Permission:
   Admissions → Admissions Process
   ========================================================= */

router.patch(
  "/admin/unpublish",
  protect,
  requireGlobalPermission("admissions", "admissions-process"),
  unpublishAdmissionProcess,
);

/* =========================================================
   ADMIN — RESET
   =========================================================
   
   POST /api/admission-process/admin/reset
   
   Permission:
   Admissions → Admissions Process
   ========================================================= */

router.post(
  "/admin/reset",
  protect,
  requireGlobalPermission("admissions", "admissions-process"),
  resetAdmissionProcess,
);

export default router;
