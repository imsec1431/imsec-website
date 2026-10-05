import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import {
  getAwardsRankingRatings,
  getAwardsRankingRatingsAdmin,
  updateAwardsRankingRatings,
  uploadRecognitionPhoto,
  deleteRecognitionPhoto,
  resetAwardsRankingRatings,
} from "../controllers/AwardsRankingRatingsController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

// Get Awards / Ranking / Ratings
router.get("/", getAwardsRankingRatings);

/* =========================================================
   ADMIN / SUB ADMIN
   Permission:
   Accreditations → Awards / Ranking / Recognition
========================================================= */

// Get admin data
router.get(
  "/admin",
  protect,
  requireGlobalPermission("accreditations", "recognition"),
  getAwardsRankingRatingsAdmin,
);

// Update Awards / Ranking / Ratings
router.put(
  "/admin",
  protect,
  requireGlobalPermission("accreditations", "recognition"),
  updateAwardsRankingRatings,
);

/* =========================================================
   PHOTO UPLOAD
========================================================= */

router.post(
  "/admin/upload-photo",
  protect,
  requireGlobalPermission("accreditations", "recognition"),
  upload.single("photo"),
  validateUploadedFiles,
  uploadRecognitionPhoto,
);

/* =========================================================
   PHOTO DELETE
========================================================= */

router.delete(
  "/admin/delete-photo",
  protect,
  requireGlobalPermission("accreditations", "recognition"),
  deleteRecognitionPhoto,
);

/* =========================================================
   RESET DEFAULTS
========================================================= */

router.post(
  "/admin/reset-defaults",
  protect,
  requireGlobalPermission("accreditations", "recognition"),
  resetAwardsRankingRatings,
);

export default router;
