import express from "express";

import {
  getAllNewsletters,
  getNewsletterById,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
} from "../controllers/newsletterController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   ADMIN / SUB ADMIN
   Permission:
   Website Content → Newsletter
========================================================= */

// Get all newsletters
router.get(
  "/",
  // protect,
  // requireGlobalPermission("website-content", "newsletter"),
  getAllNewsletters,
);

// Create newsletter
router.post(
  "/",
  protect,
  requireGlobalPermission("website-content", "newsletter"),
  createNewsletter,
);

// Get single newsletter
router.get(
  "/:id",
  protect,
  requireGlobalPermission("website-content", "newsletter"),
  getNewsletterById,
);

// Update newsletter
router.put(
  "/:id",
  protect,
  requireGlobalPermission("website-content", "newsletter"),
  updateNewsletter,
);

// Delete newsletter
router.delete(
  "/:id",
  protect,
  requireGlobalPermission("website-content", "newsletter"),
  deleteNewsletter,
);

export default router;
