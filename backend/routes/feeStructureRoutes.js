import express from "express";

import {
  getAdminFeeStructure,
  getPublicFeeStructure,
  createFeeStructure,
  updateFeeStructure,
  publishFeeStructure,
  unpublishFeeStructure,
  resetFeeStructure,
} from "../controllers/feeStructureController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* PUBLIC */

router.get("/public", getPublicFeeStructure);

/* ADMIN */

router.get(
  "/admin",
  protect,
  requireGlobalPermission("admissions", "fee-structure"),
  getAdminFeeStructure,
);

router.post(
  "/admin",
  protect,
  requireGlobalPermission("admissions", "fee-structure"),
  createFeeStructure,
);

router.put(
  "/admin",
  protect,
  requireGlobalPermission("admissions", "fee-structure"),
  updateFeeStructure,
);

router.patch(
  "/admin/publish",
  protect,
  requireGlobalPermission("admissions", "fee-structure"),
  publishFeeStructure,
);

router.patch(
  "/admin/unpublish",
  protect,
  requireGlobalPermission("admissions", "fee-structure"),
  unpublishFeeStructure,
);

router.post(
  "/admin/reset",
  protect,
  requireGlobalPermission("admissions", "fee-structure"),
  resetFeeStructure,
);

export default router;
