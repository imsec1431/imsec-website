import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import upload from "../middleware/multerMiddleware.js";

import {
  getCDCStructure,
  getCDCStructureAdmin,
  createCDCStructure,
  updateCDCStructure,
  deleteCDCStructure,
} from "../controllers/cdcStructureController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================
   PUBLIC
   GET /api/cdc-structure
========================================= */

router.get("/", getCDCStructure);

/* =========================================
   ADMIN - GET
   GET /api/cdc-structure/admin
========================================= */

router.get("/admin", protect,
  requireGlobalPermission("placements", "cdc-structure"), getCDCStructureAdmin);

/* =========================================
   ADMIN - CREATE
   POST /api/cdc-structure
========================================= */

router.post("/", protect,
  requireGlobalPermission("placements", "cdc-structure"), upload.single("image"),
  validateUploadedFiles, createCDCStructure);

/* =========================================
   ADMIN - UPDATE
   PUT /api/cdc-structure
========================================= */

router.put("/", protect,
  requireGlobalPermission("placements", "cdc-structure"), upload.single("image"),
  validateUploadedFiles, updateCDCStructure);

/* =========================================
   ADMIN - DELETE
   DELETE /api/cdc-structure
========================================= */

router.delete("/", protect,
  requireGlobalPermission("placements", "cdc-structure"), deleteCDCStructure);

export default router;
