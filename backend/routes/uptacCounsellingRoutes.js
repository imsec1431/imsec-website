import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import {
  getUptacCounselling,
  getPublicUptacCounselling,
  getPublicUptacPdf,
  createUptacCounselling,
  updateUptacCounselling,
  publishUptacCounselling,
  unpublishUptacCounselling,
  deleteUptacCounselling,
} from "../controllers/uptacCounsellingController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* PUBLIC */

router.get("/public", getPublicUptacCounselling);

router.get("/public/pdf", getPublicUptacPdf);

/* ADMIN */

router.get(
  "/admin",
  protect,
  requireGlobalPermission("admissions", "uptac-counselling"),
  getUptacCounselling,
);

router.post(
  "/admin",
  protect,
  requireGlobalPermission("admissions", "uptac-counselling"),
  upload.single("pdfFile"),
  validateUploadedFiles,
  createUptacCounselling,
);

router.put(
  "/admin/:id",
  protect,
  requireGlobalPermission("admissions", "uptac-counselling"),
  upload.single("pdfFile"),
  validateUploadedFiles,
  updateUptacCounselling,
);

router.patch(
  "/admin/:id/publish",
  protect,
  requireGlobalPermission("admissions", "uptac-counselling"),
  publishUptacCounselling,
);

router.patch(
  "/admin/:id/unpublish",
  protect,
  requireGlobalPermission("admissions", "uptac-counselling"),
  unpublishUptacCounselling,
);

router.delete(
  "/admin/:id",
  protect,
  requireGlobalPermission("admissions", "uptac-counselling"),
  deleteUptacCounselling,
);

export default router;
