import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import {
  getEvents,
  getEventsAdmin,
  updateEvents,
  deleteEvent,
  deleteFeaturedEvent,
  resetEventsDefaults,
} from "../controllers/eventController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC EVENTS
|--------------------------------------------------------------------------
*/

// Get Events page data
router.get("/", getEvents);

/*
|--------------------------------------------------------------------------
| ADMIN EVENTS
|--------------------------------------------------------------------------
*/

// Get Events data for admin panel
router.get("/admin", protect,
  requireGlobalPermission("life-imsec", "events"), getEventsAdmin);

// Update complete Events page
//
// IMPORTANT:
// We are using the existing multerMiddleware.js.
// It is required only for event images.
// PDF files are NOT uploaded.
// PDF values are saved as URLs/links.
router.put("/admin", protect,
  requireGlobalPermission("life-imsec", "events"), upload.any(),
  validateUploadedFiles, updateEvents);

// Delete an event from:
// latest
// memorable
// signature
router.delete("/admin/:section/:eventId", protect,
  requireGlobalPermission("life-imsec", "events"), deleteEvent);

// Remove the currently selected Featured Event
router.delete("/admin/featured", protect,
  requireGlobalPermission("life-imsec", "events"), deleteFeaturedEvent);

// Reset Events page to default data
router.post("/admin/reset-defaults", protect,
  requireGlobalPermission("life-imsec", "events"), resetEventsDefaults);

export default router;
