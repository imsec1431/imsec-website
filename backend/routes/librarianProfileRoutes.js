import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import { protect } from "../middleware/authMiddleware.js";


import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

import {
  getLibrarianProfile,
  saveLibrarianProfile,
} from "../controllers/librarianProfileController.js";

const router = express.Router();

// Get Profile
router.get("/", getLibrarianProfile);

// Save / Update Profile
router.post(
  "/",
  protect,
  requireGlobalPermission("library", "librarian"), upload.single("image"),
  validateUploadedFiles, saveLibrarianProfile);

export default router;
