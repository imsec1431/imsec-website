import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import upload from "../middleware/multerMiddleware.js";

import {
  createAlumni,
  getAlumni,
  getAlumniById,
  updateAlumni,
  deleteAlumni,
} from "../controllers/alumniController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

router.get("/", getAlumni);

router.get("/:id", getAlumniById);

/* =========================================================
   ADMIN / SUB ADMIN
   Permission: Alumni → Overview
========================================================= */

router.post(
  "/",
  protect,
  requireGlobalPermission("alumni", "overview"),
  upload.single("image"),
  validateUploadedFiles,
  createAlumni,
);

router.put(
  "/:id",
  protect,
  requireGlobalPermission("alumni", "overview"),
  upload.single("image"),
  validateUploadedFiles,
  updateAlumni,
);

router.delete(
  "/:id",
  protect,
  requireGlobalPermission("alumni", "overview"),
  deleteAlumni,
);

export default router;
