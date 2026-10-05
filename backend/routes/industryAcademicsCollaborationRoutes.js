import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import {
  getIndustryAcademicsCollaboration,
  getIndustryAcademicsCollaborationAdmin,
  updateIndustryAcademicsCollaboration,
  uploadIndustryAcademicsPhoto,
  deleteIndustryAcademicsPhoto,
  resetIndustryAcademicsCollaboration,
} from "../controllers/IndustryAcademicsCollaborationController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

// Get Industry Academics Collaboration
router.get("/", getIndustryAcademicsCollaboration);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

// Get data for admin
router.get("/admin", protect,
  requireGlobalPermission("coe", "industry-academics-collaboration"), getIndustryAcademicsCollaborationAdmin);

// Update data
router.put("/admin", protect,
  requireGlobalPermission("coe", "industry-academics-collaboration"), updateIndustryAcademicsCollaboration);

// Upload one photograph
router.post(
  "/admin/upload-photo",
  protect,
  requireGlobalPermission("coe", "industry-academics-collaboration"),
  upload.single("photo"),
  validateUploadedFiles,
  uploadIndustryAcademicsPhoto,
);

// Delete photograph from Cloudinary
router.delete("/admin/delete-photo", protect,
  requireGlobalPermission("coe", "industry-academics-collaboration"), deleteIndustryAcademicsPhoto);

// Reset defaults
router.post(
  "/admin/reset-defaults",
  protect,
  requireGlobalPermission("coe", "industry-academics-collaboration"),
  resetIndustryAcademicsCollaboration,
);

export default router;
