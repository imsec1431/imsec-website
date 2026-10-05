import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

import {
  uploadPhoto,
  getAllPhotos,
  getSinglePhoto,
  deletePhoto,
  updatePhoto,
} from "../controllers/uploadController.js";

const router = express.Router();

// Upload Image
router.post("/photos", protect, upload.array("file", 20),
  validateUploadedFiles, uploadPhoto);

// Get All Images
router.get("/photos", getAllPhotos);
router.get("/photos/:id", getSinglePhoto);
router.delete("/photos/:id", protect, deletePhoto);
router.put("/photos/:id", protect, upload.single("file"),
  validateUploadedFiles, updatePhoto);

export default router;
