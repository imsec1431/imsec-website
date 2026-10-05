import express from "express";

import {
  getDepartmentAchievements,
  getDepartmentAchievementsBySlug,
  createDepartmentAchievements,
  updateDepartmentAchievements,
  deleteDepartmentAchievements,
} from "../controllers/departmentAchievementController.js";

import { protect } from "../middleware/authMiddleware.js";

import { requireDepartmentPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   GET ACHIEVEMENTS BY DEPARTMENT SLUG

   GET
   /api/department-achievements/slug/:slug

   PUBLIC
========================================================= */

router.get("/slug/:slug", getDepartmentAchievementsBySlug);

/* =========================================================
   GET ACHIEVEMENTS BY DEPARTMENT ID

   GET
   /api/department-achievements/:departmentId

   ADMIN / SUB-ADMIN

   Permission:
   Department → Achievements
========================================================= */

router.get(
  "/:departmentId",
  protect,
  requireDepartmentPermission("achievements"),
  getDepartmentAchievements,
);

/* =========================================================
   CREATE ACHIEVEMENTS

   POST
   /api/department-achievements

   Permission:
   Department → Achievements
========================================================= */

router.post(
  "/",
  protect,
  requireDepartmentPermission("achievements"),
  createDepartmentAchievements,
);

/* =========================================================
   UPDATE ACHIEVEMENTS

   PUT
   /api/department-achievements/:departmentId

   Permission:
   Department → Achievements
========================================================= */

router.put(
  "/:departmentId",
  protect,
  requireDepartmentPermission("achievements"),
  updateDepartmentAchievements,
);

/* =========================================================
   DELETE ACHIEVEMENTS

   DELETE
   /api/department-achievements/:departmentId

   Permission:
   Department → Achievements
========================================================= */

router.delete(
  "/:departmentId",
  protect,
  requireDepartmentPermission("achievements"),
  deleteDepartmentAchievements,
);

export default router;
