import express from "express";

import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import multer from "multer";

import {
  getDepartmentAchievementItems,
  getPublicDepartmentAchievementItems,
  getDepartmentAchievementItemById,
  createDepartmentAchievementItem,
  updateDepartmentAchievementItem,
  deleteDepartmentAchievementItem,
} from "../controllers/departmentAchievementItemController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireDepartmentPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   MULTER CONFIGURATION
   Temporary local upload
========================================================= */

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

/* =========================================================
   ADMIN / SUB ADMIN
   GET ALL ACHIEVEMENTS OF A DEPARTMENT

   Permission:
   Departments → Achievements
========================================================= */

router.get(
  "/department/:departmentId",
  protect,
  requireDepartmentPermission("achievements"),
  getDepartmentAchievementItems,
);

/* =========================================================
   PUBLIC
   GET ACTIVE ACHIEVEMENTS OF A DEPARTMENT
========================================================= */

router.get("/public/:departmentId", getPublicDepartmentAchievementItems);

/* =========================================================
   ADMIN / SUB ADMIN
   GET SINGLE ACHIEVEMENT

   :id = Achievement ID

   permissionMiddleware resolves:
   Achievement → departmentId → assigned department
========================================================= */

router.get(
  "/:id",
  protect,
  requireDepartmentPermission("achievements"),
  getDepartmentAchievementItemById,
);

/* =========================================================
   ADMIN / SUB ADMIN
   CREATE

   POST
   /api/department-achievement-items

   departmentId comes from request body.
========================================================= */

router.post(
  "/",
  protect,
  requireDepartmentPermission("achievements"),
  upload.single("image"),
  validateUploadedFiles,
  createDepartmentAchievementItem,
);

/* =========================================================
   ADMIN / SUB ADMIN
   UPDATE

   PUT
   /api/department-achievement-items/:id

   :id = Achievement ID
========================================================= */

router.put(
  "/:id",
  protect,
  requireDepartmentPermission("achievements"),
  upload.single("image"),
  validateUploadedFiles,
  updateDepartmentAchievementItem,
);

/* =========================================================
   ADMIN / SUB ADMIN
   DELETE

   DELETE
   /api/department-achievement-items/:id

   :id = Achievement ID
========================================================= */

router.delete(
  "/:id",
  protect,
  requireDepartmentPermission("achievements"),
  deleteDepartmentAchievementItem,
);

export default router;
