import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import {
  getPublicMajorRecruiters,
  getAdminMajorRecruiters,
  createMajorRecruiter,
  updateMajorRecruiter,
  deleteMajorRecruiter,
} from "../controllers/majorRecruiterController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

/* =========================================
   PUBLIC
========================================= */

router.get("/", getPublicMajorRecruiters);

/* =========================================
   ADMIN
========================================= */

router.get("/admin", protect,
  requireGlobalPermission("placements", "major-recruiters"), getAdminMajorRecruiters);

/* =========================================
   CREATE
========================================= */

router.post("/", protect,
  requireGlobalPermission("placements", "major-recruiters"), upload.single("image"),
  validateUploadedFiles, createMajorRecruiter);

/* =========================================
   UPDATE
========================================= */

router.put("/:id", protect,
  requireGlobalPermission("placements", "major-recruiters"), upload.single("image"),
  validateUploadedFiles, updateMajorRecruiter);

/* =========================================
   DELETE
========================================= */

router.delete("/:id", protect,
  requireGlobalPermission("placements", "major-recruiters"), deleteMajorRecruiter);

export default router;
