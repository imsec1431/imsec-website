import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireDepartmentPermission } from "../middleware/permissionMiddleware.js";
import multer from "multer";

import {
  getFacultyAchievementItems,
  getPublicFacultyAchievementItems,
  getFacultyAchievementItemById,
  createFacultyAchievementItem,
  updateFacultyAchievementItem,
  deleteFacultyAchievementItem,
} from "../controllers/facultyAchievementItemController.js";

const router = express.Router();

/* =========================================================
   MULTER CONFIGURATION
   Temporary local upload
========================================================= */

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
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
   ADMIN
   GET ALL FACULTY ACHIEVEMENTS
   BY DEPARTMENT
========================================================= */

router.get("/department/:departmentId", protect, requireDepartmentPermission("faculty", "faculty-achievements"), getFacultyAchievementItems);

/* =========================================================
   PUBLIC
   GET ACTIVE FACULTY ACHIEVEMENTS
   BY DEPARTMENT
========================================================= */

router.get("/public/:departmentId", getPublicFacultyAchievementItems);

/* =========================================================
   GET SINGLE FACULTY ACHIEVEMENT
========================================================= */

router.get("/:id", protect, requireDepartmentPermission("faculty", "faculty-achievements"), getFacultyAchievementItemById);

/* =========================================================
   CREATE FACULTY ACHIEVEMENT
   POST /api/faculty-achievement-items
========================================================= */

router.post("/", protect, requireDepartmentPermission("faculty", "faculty-achievements"), upload.single("image"),
  validateUploadedFiles, createFacultyAchievementItem);

/* =========================================================
   UPDATE FACULTY ACHIEVEMENT
   PUT /api/faculty-achievement-items/:id
========================================================= */

router.put("/:id", protect, requireDepartmentPermission("faculty", "faculty-achievements"), upload.single("image"),
  validateUploadedFiles, updateFacultyAchievementItem);

/* =========================================================
   DELETE FACULTY ACHIEVEMENT
   DELETE /api/faculty-achievement-items/:id
========================================================= */

router.delete("/:id", protect, requireDepartmentPermission("faculty", "faculty-achievements"), deleteFacultyAchievementItem);

export default router;
