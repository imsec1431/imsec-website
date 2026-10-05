import express from "express";

import {
  getAdminGovernmentScholarshipPolicy,
  createGovernmentScholarshipPolicy,
  updateGovernmentScholarshipPolicy,
  publishGovernmentScholarshipPolicy,
  unpublishGovernmentScholarshipPolicy,
  getPublicGovernmentScholarshipPolicy,
} from "../controllers/governmentScholarshipPolicyController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* PUBLIC */

router.get("/public", getPublicGovernmentScholarshipPolicy);

/* ADMIN */

router.get(
  "/admin",
  protect,
  requireGlobalPermission("admissions", "government-scholarship-policy"),
  getAdminGovernmentScholarshipPolicy,
);

router.post(
  "/admin",
  protect,
  requireGlobalPermission("admissions", "government-scholarship-policy"),
  createGovernmentScholarshipPolicy,
);

router.put(
  "/admin",
  protect,
  requireGlobalPermission("admissions", "government-scholarship-policy"),
  updateGovernmentScholarshipPolicy,
);

router.patch(
  "/admin/publish",
  protect,
  requireGlobalPermission("admissions", "government-scholarship-policy"),
  publishGovernmentScholarshipPolicy,
);

router.patch(
  "/admin/unpublish",
  protect,
  requireGlobalPermission("admissions", "government-scholarship-policy"),
  unpublishGovernmentScholarshipPolicy,
);

export default router;
