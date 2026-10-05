import express from "express";

import {
  addAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

// Get All Announcements
router.get("/", getAnnouncements);

// Get Single Announcement
router.get("/:id", getAnnouncement);

/* =========================================================
   ADMIN / SUB ADMIN
   Permission: Announcement → Management
========================================================= */

// Add Announcement
router.post(
  "/",
  protect,
  requireGlobalPermission("announcement", "management"),
  addAnnouncement,
);

// Update Announcement
router.put(
  "/:id",
  protect,
  requireGlobalPermission("announcement", "management"),
  updateAnnouncement,
);

// Delete Announcement
router.delete(
  "/:id",
  protect,
  requireGlobalPermission("announcement", "management"),
  deleteAnnouncement,
);

export default router;
