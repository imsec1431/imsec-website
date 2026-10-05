import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import {
  getTrainingInternship,
  getTrainingInternshipAdmin,
  updateTrainingInternship,
  deleteTrainingTeamMember,
  deleteTrainingDocument,
  resetTrainingInternship,
} from "../controllers/TrainingInternshipController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

router.get("/", getTrainingInternship);

/* =========================================================
   ADMIN — GET
========================================================= */

router.get("/admin", protect,
  requireGlobalPermission("placements", "training-internship"), getTrainingInternshipAdmin);

/* =========================================================
   ADMIN — UPDATE
========================================================= */

router.put("/admin", protect,
  requireGlobalPermission("placements", "training-internship"), upload.any(),
  validateUploadedFiles, updateTrainingInternship);

/* =========================================================
   ADMIN — DELETE TEAM MEMBER
========================================================= */

router.delete("/admin/team/:id", protect,
  requireGlobalPermission("placements", "training-internship"), deleteTrainingTeamMember);

/* =========================================================
   ADMIN — DELETE DOCUMENT
========================================================= */

router.delete("/admin/document/:id", protect,
  requireGlobalPermission("placements", "training-internship"), deleteTrainingDocument);

/* =========================================================
   ADMIN — RESET DEFAULTS
========================================================= */

router.post("/admin/reset-defaults", protect,
  requireGlobalPermission("placements", "training-internship"), resetTrainingInternship);

export default router;
