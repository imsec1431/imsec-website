import express from "express";

import {
  getCourses,
  getPublishedCourses,
  getCoursesByCategory,
  getCoursesByCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC ROUTES
========================================================= */

router.get("/public", getPublishedCourses);

router.get("/category/:category", getCoursesByCategory);

router.get("/category/:category/:courseName", getCoursesByCourse);

/* =========================================================
   ADMIN ROUTES
========================================================= */

router.get(
  "/",
  protect,
  requireGlobalPermission("academics", "courses"),
  getCourses,
);

router.post(
  "/",
  protect,
  requireGlobalPermission("academics", "courses"),
  createCourse,
);

router.put(
  "/:id",
  protect,
  requireGlobalPermission("academics", "courses"),
  updateCourse,
);

router.delete(
  "/:id",
  protect,
  requireGlobalPermission("academics", "courses"),
  deleteCourse,
);

export default router;
