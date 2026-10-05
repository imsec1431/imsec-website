import express from "express";

import {
  createAcademicCalendar,
  getAcademicCalendars,
  getPublicAcademicCalendars,
  getAcademicCalendarById,
  getPublicAcademicCalendarById,
  updateAcademicCalendar,
  deleteAcademicCalendar,
} from "../controllers/academicCalendarController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
| These routes are required by the public college website.
| No authentication or permission is required.
|--------------------------------------------------------------------------
*/

/*
 * Get published Academic Calendars
 */
router.get("/public", getPublicAcademicCalendars);

/*
 * Get a single published Academic Calendar
 */
router.get("/public/:id", getPublicAcademicCalendarById);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN ROUTES
|--------------------------------------------------------------------------
| Permission:
| Academics → Academic Calendar
|--------------------------------------------------------------------------
*/

/*
 * Get all Academic Calendars
 */
router.get(
  "/",
  protect,
  requireGlobalPermission("academics", "academic-calendar"),
  getAcademicCalendars,
);

/*
 * Get a single Academic Calendar
 */
router.get(
  "/:id",
  protect,
  requireGlobalPermission("academics", "academic-calendar"),
  getAcademicCalendarById,
);

/*
 * Create Academic Calendar
 */
router.post(
  "/",
  protect,
  requireGlobalPermission("academics", "academic-calendar"),
  createAcademicCalendar,
);

/*
 * Update Academic Calendar
 */
router.put(
  "/:id",
  protect,
  requireGlobalPermission("academics", "academic-calendar"),
  updateAcademicCalendar,
);

/*
 * Delete Academic Calendar
 */
router.delete(
  "/:id",
  protect,
  requireGlobalPermission("academics", "academic-calendar"),
  deleteAcademicCalendar,
);

export default router;
