import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import upload from "../middleware/multerMiddleware.js";

import {
  getPublicCDCTeam,
  getAdminCDCTeam,
  createCDCTeamMember,
  updateCDCTeamMember,
  deleteCDCTeamMember,
} from "../controllers/cdcTeamController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================
   PUBLIC
========================================= */

router.get("/", getPublicCDCTeam);

/* =========================================
   ADMIN - GET
========================================= */

router.get("/admin", protect,
  requireGlobalPermission("placements", "cdc-team"), getAdminCDCTeam);

/* =========================================
   ADMIN - CREATE
========================================= */

router.post("/", protect,
  requireGlobalPermission("placements", "cdc-team"), upload.single("image"),
  validateUploadedFiles, createCDCTeamMember);

/* =========================================
   ADMIN - UPDATE
========================================= */

router.put("/:id", protect,
  requireGlobalPermission("placements", "cdc-team"), upload.single("image"),
  validateUploadedFiles, updateCDCTeamMember);

/* =========================================
   ADMIN - DELETE
========================================= */

router.delete("/:id", protect,
  requireGlobalPermission("placements", "cdc-team"), deleteCDCTeamMember);

export default router;
