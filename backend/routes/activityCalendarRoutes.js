import express from "express";

import {
  createActivityCalendar,
  getActivityCalendars,
  getPublicActivityCalendars,
  getActivityCalendarById,
  getPublicActivityCalendarById,
  updateActivityCalendar,
  deleteActivityCalendar,
} from "../controllers/activityCalendarController.js";

import { protect } from "../middleware/authMiddleware.js";

import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC ROUTES
   ========================================================= */

/*
 * Get published/public activity calendars
 *
 * GET /api/activity-calendar/public
 */
router.get("/public", getPublicActivityCalendars);

/*
 * Get a single public activity calendar
 *
 * GET /api/activity-calendar/public/:id
 */
router.get("/public/:id", getPublicActivityCalendarById);

/* =========================================================
   ADMIN ROUTES
   =========================================================
   
   Permission:
   Academics → Activity Calendar
   
   Key:
   academics → activity-calendar
   ========================================================= */

/*
 * Get all activity calendars
 */
router.get(
  "/",
  protect,
  requireGlobalPermission("academics", "activity-calendar"),
  getActivityCalendars,
);

/*
 * Get activity calendar by ID
 */
router.get(
  "/:id",
  protect,
  requireGlobalPermission("academics", "activity-calendar"),
  getActivityCalendarById,
);

/*
 * Create activity calendar
 */
router.post(
  "/",
  protect,
  requireGlobalPermission("academics", "activity-calendar"),
  createActivityCalendar,
);

/*
 * Update activity calendar
 */
router.put(
  "/:id",
  protect,
  requireGlobalPermission("academics", "activity-calendar"),
  updateActivityCalendar,
);

/*
 * Delete activity calendar
 */
router.delete(
  "/:id",
  protect,
  requireGlobalPermission("academics", "activity-calendar"),
  deleteActivityCalendar,
);

export default router;
