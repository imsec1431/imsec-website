import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import { protect } from "../middleware/authMiddleware.js";


import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import upload from "../middleware/multerMiddleware.js";

import {
  addGalleryImage,
  getGalleryImages,
  getGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "../controllers/libraryGalleryController.js";

const router = express.Router();

// ======================================
// Get All Images
// ======================================

router.get("/", getGalleryImages);

// ======================================
// Get Single Image
// ======================================

router.get("/:id", getGalleryImage);

// ======================================
// Add Image
// ======================================

router.post(
  "/",
  protect,
  requireGlobalPermission("library", "gallery"), upload.single("image"),
  validateUploadedFiles, addGalleryImage);

// ======================================
// Update Image
// ======================================

router.put(
  "/:id",
  protect,
  requireGlobalPermission("library", "gallery"), upload.single("image"),
  validateUploadedFiles, updateGalleryImage);

// ======================================
// Delete Image
// ======================================

router.delete(
  "/:id",
  protect,
  requireGlobalPermission("library", "gallery"), deleteGalleryImage);

export default router;
