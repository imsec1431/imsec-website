import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import {
  getLanguageCommunicationLab,
  getLanguageCommunicationLabAdmin,
  updateLanguageCommunicationLab,
  resetLanguageCommunicationLabDefaults,
} from "../controllers/languageCommunicationLabController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

// Public
router.get("/", getLanguageCommunicationLab);

// Admin
router.get("/admin", protect,
  requireGlobalPermission("life-imsec", "language-communication-lab"), getLanguageCommunicationLabAdmin);

// Update
router.put("/admin", protect,
  requireGlobalPermission("life-imsec", "language-communication-lab"), upload.any(),
  validateUploadedFiles, updateLanguageCommunicationLab);

// Restore defaults
router.post(
  "/admin/reset-defaults",
  protect,
  requireGlobalPermission("life-imsec", "language-communication-lab"),
  resetLanguageCommunicationLabDefaults,
);

export default router;
