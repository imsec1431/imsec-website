import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import upload from "../middleware/multerMiddleware.js";

import {
  getAdminPaymentProcedure,
  createPaymentProcedure,
  updatePaymentProcedure,
  publishPaymentProcedure,
  unpublishPaymentProcedure,
  getPublicPaymentProcedure,
} from "../controllers/paymentProcedureController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* PUBLIC */

router.get("/public", getPublicPaymentProcedure);

/* ADMIN */

router.get(
  "/admin",
  protect,
  requireGlobalPermission("admissions", "payment-procedure"),
  getAdminPaymentProcedure,
);

router.post(
  "/admin",
  protect,
  requireGlobalPermission("admissions", "payment-procedure"),
  upload.single("qrCode"),
  validateUploadedFiles,
  createPaymentProcedure,
);

router.put(
  "/admin",
  protect,
  requireGlobalPermission("admissions", "payment-procedure"),
  upload.single("qrCode"),
  validateUploadedFiles,
  updatePaymentProcedure,
);

router.patch(
  "/admin/publish",
  protect,
  requireGlobalPermission("admissions", "payment-procedure"),
  publishPaymentProcedure,
);

router.patch(
  "/admin/unpublish",
  protect,
  requireGlobalPermission("admissions", "payment-procedure"),
  unpublishPaymentProcedure,
);

export default router;
