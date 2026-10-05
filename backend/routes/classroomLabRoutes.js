import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import {
  getClassroomLab,
  getClassroomLabAdmin,
  updateClassroomLab,
  resetClassroomLabDefaults,
} from "../controllers/classroomLabController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

router.get("/", getClassroomLab);

/* =========================================================
   ADMIN
========================================================= */

router.get(
  "/admin",
  protect,
  requireGlobalPermission("academics", "classroom-labs"),
  getClassroomLabAdmin,
);

router.put(
  "/admin",
  protect,
  requireGlobalPermission("academics", "classroom-labs"),
  upload.any(),
  validateUploadedFiles,
  updateClassroomLab,
);

router.post(
  "/admin/reset-defaults",
  protect,
  requireGlobalPermission("academics", "classroom-labs"),
  resetClassroomLabDefaults,
);

export default router;
