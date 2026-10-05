import express from "express";

import {
  getAdminFAQ,
  getPublicFAQ,
  createFAQ,
  updateFAQ,
  publishFAQ,
  unpublishFAQ,
  resetFAQ,
} from "../controllers/faqController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* PUBLIC */

router.get("/public", getPublicFAQ);

/* ADMIN */

router.get(
  "/admin",
  protect,
  requireGlobalPermission("admissions", "faq"),
  getAdminFAQ,
);

router.post(
  "/admin",
  protect,
  requireGlobalPermission("admissions", "faq"),
  createFAQ,
);

router.put(
  "/admin",
  protect,
  requireGlobalPermission("admissions", "faq"),
  updateFAQ,
);

router.patch(
  "/admin/publish",
  protect,
  requireGlobalPermission("admissions", "faq"),
  publishFAQ,
);

router.patch(
  "/admin/unpublish",
  protect,
  requireGlobalPermission("admissions", "faq"),
  unpublishFAQ,
);

router.post(
  "/admin/reset",
  protect,
  requireGlobalPermission("admissions", "faq"),
  resetFAQ,
);

export default router;
