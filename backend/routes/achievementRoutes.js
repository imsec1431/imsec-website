import express from "express";

import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import upload from "../middleware/multerMiddleware.js";

import {
  createAchievement,
  getAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement,
} from "../controllers/achievementController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| Get all achievements.
|
| The public website displays achievements, so GET remains public.
|--------------------------------------------------------------------------
*/

router.get("/", getAchievements);

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| Get a single achievement.
|--------------------------------------------------------------------------
*/

router.get("/:id", getAchievementById);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Create achievement.
|
| Permission:
| Homepage → Achievements
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  protect,
  requireGlobalPermission("homepage", "achievements"),
  upload.single("image"),
  validateUploadedFiles,
  createAchievement,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Update achievement.
|
| Permission:
| Homepage → Achievements
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  protect,
  requireGlobalPermission("homepage", "achievements"),
  upload.single("image"),
  validateUploadedFiles,
  updateAchievement,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Delete achievement.
|
| Permission:
| Homepage → Achievements
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  protect,
  requireGlobalPermission("homepage", "achievements"),
  deleteAchievement,
);

export default router;
