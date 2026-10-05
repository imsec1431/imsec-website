import express from "express";

import {
  getPublicSocialMedia,
  getAdminSocialMedia,
  createSocialMedia,
  updateSocialMedia,
  activateSocialMedia,
  deactivateSocialMedia,
  deleteSocialMedia,
} from "../controllers/socialMediaController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

// Get active social media links
router.get("/", getPublicSocialMedia);

/* =========================================================
   ADMIN / SUB ADMIN
   Permission:
   Website Content → Social Media
========================================================= */

// Get all social media entries
router.get(
  "/admin",
  protect,
  requireGlobalPermission("website-content", "social-media"),
  getAdminSocialMedia,
);

// Create social media
router.post(
  "/admin",
  protect,
  requireGlobalPermission("website-content", "social-media"),
  createSocialMedia,
);

// Update social media
router.put(
  "/admin/:id",
  protect,
  requireGlobalPermission("website-content", "social-media"),
  updateSocialMedia,
);

// Activate social media
router.patch(
  "/admin/:id/activate",
  protect,
  requireGlobalPermission("website-content", "social-media"),
  activateSocialMedia,
);

// Deactivate social media
router.patch(
  "/admin/:id/deactivate",
  protect,
  requireGlobalPermission("website-content", "social-media"),
  deactivateSocialMedia,
);

// Delete social media
router.delete(
  "/admin/:id",
  protect,
  requireGlobalPermission("website-content", "social-media"),
  deleteSocialMedia,
);

export default router;
