import express from "express";

import {
  getPublicNewsTicker,
  getAdminNewsTicker,
  createNewsTicker,
  updateNewsTicker,
  publishNewsTicker,
  unpublishNewsTicker,
  deleteNewsTicker,
} from "../controllers/newsTickerController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
   ========================================================= */

// Public News Ticker
router.get("/", getPublicNewsTicker);

/* =========================================================
   ADMIN / SUB ADMIN
   Permission:
   Website Content → News Ticker
   ========================================================= */

// Get all News Ticker entries
router.get(
  "/admin",
  protect,
  requireGlobalPermission("website-content", "news-ticker"),
  getAdminNewsTicker,
);

// Create News Ticker
router.post(
  "/admin",
  protect,
  requireGlobalPermission("website-content", "news-ticker"),
  createNewsTicker,
);

// Update News Ticker
router.put(
  "/admin/:id",
  protect,
  requireGlobalPermission("website-content", "news-ticker"),
  updateNewsTicker,
);

// Publish News Ticker
router.patch(
  "/admin/:id/publish",
  protect,
  requireGlobalPermission("website-content", "news-ticker"),
  publishNewsTicker,
);

// Unpublish News Ticker
router.patch(
  "/admin/:id/unpublish",
  protect,
  requireGlobalPermission("website-content", "news-ticker"),
  unpublishNewsTicker,
);

// Delete News Ticker
router.delete(
  "/admin/:id",
  protect,
  requireGlobalPermission("website-content", "news-ticker"),
  deleteNewsTicker,
);

export default router;
