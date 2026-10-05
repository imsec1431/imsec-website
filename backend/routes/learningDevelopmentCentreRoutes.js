import express from "express";

import {
  getAllLearningDevelopmentCentres,
  getPublishedLearningDevelopmentCentres,
  getLearningDevelopmentCentreById,
  createLearningDevelopmentCentre,
  updateLearningDevelopmentCentre,
  deleteLearningDevelopmentCentre,
  toggleLearningDevelopmentCentreStatus,
} from "../controllers/learningDevelopmentCentreController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
   GET /api/learning-development-centre
   ========================================================= */

router.get("/", getPublishedLearningDevelopmentCentres);

/* =========================================================
   ADMIN — GET ALL
   GET /api/learning-development-centre/admin

   Permission:
   Academics → Learning Development Centre
   ========================================================= */

router.get(
  "/admin",
  protect,
  requireGlobalPermission("academics", "learning-development-centre"),
  getAllLearningDevelopmentCentres,
);

/* =========================================================
   ADMIN — GET SINGLE
   GET /api/learning-development-centre/admin/:id

   Permission:
   Academics → Learning Development Centre
   ========================================================= */

router.get(
  "/admin/:id",
  protect,
  requireGlobalPermission("academics", "learning-development-centre"),
  getLearningDevelopmentCentreById,
);

/* =========================================================
   ADMIN — CREATE
   POST /api/learning-development-centre/admin

   Permission:
   Academics → Learning Development Centre
   ========================================================= */

router.post(
  "/admin",
  protect,
  requireGlobalPermission("academics", "learning-development-centre"),
  createLearningDevelopmentCentre,
);

/* =========================================================
   ADMIN — UPDATE
   PUT /api/learning-development-centre/admin/:id

   Permission:
   Academics → Learning Development Centre
   ========================================================= */

router.put(
  "/admin/:id",
  protect,
  requireGlobalPermission("academics", "learning-development-centre"),
  updateLearningDevelopmentCentre,
);

/* =========================================================
   ADMIN — DELETE
   DELETE /api/learning-development-centre/admin/:id

   Permission:
   Academics → Learning Development Centre
   ========================================================= */

router.delete(
  "/admin/:id",
  protect,
  requireGlobalPermission("academics", "learning-development-centre"),
  deleteLearningDevelopmentCentre,
);

/* =========================================================
   ADMIN — PUBLISH / DRAFT
   PATCH /api/learning-development-centre/admin/:id/status

   Permission:
   Academics → Learning Development Centre
   ========================================================= */

router.patch(
  "/admin/:id/status",
  protect,
  requireGlobalPermission("academics", "learning-development-centre"),
  toggleLearningDevelopmentCentreStatus,
);

export default router;
