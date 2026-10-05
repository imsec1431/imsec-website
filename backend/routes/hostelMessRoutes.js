import express from "express";

import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import multer from "multer";

import {
  getHostelMess,
  getHostelMessAdmin,
  updateHostelMess,
  resetHostelMessDefaults,
} from "../controllers/hostelMessController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   MULTER CONFIGURATION
========================================================= */

/*
  We use memory storage because the Cloudinary uploader
  can receive the temporary file directly.

  If your existing Cloudinary setup expects file.path,
  we will use disk storage instead.
*/

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 60,
  },
});

/* =========================================================
   PUBLIC
========================================================= */

/*
  Public Hostel & Mess page
*/
router.get("/", getHostelMess);

/* =========================================================
   ADMIN
========================================================= */

/*
  IMPORTANT:
  All routes below use protect middleware.

  Therefore:
  Authorization:
  Bearer <JWT_TOKEN>

  is required.
*/

/*
  Get Hostel & Mess CMS data
*/
router.get("/admin", protect,
  requireGlobalPermission("life-imsec", "hostel-mess"), getHostelMessAdmin);

/*
  Update Hostel & Mess CMS data

  upload.any(),
  validateUploadedFiles is used because the admin page can
  dynamically contain:

  aboutImage
  messImage
  boysImage_0
  boysImage_1
  girlsImage_0
  galleryImage_0
  galleryImage_1
  ...
*/
router.put("/admin", protect,
  requireGlobalPermission("life-imsec", "hostel-mess"), upload.any(),
  validateUploadedFiles, updateHostelMess);

/*
  Restore complete default data
*/
router.post("/admin/reset-defaults", protect,
  requireGlobalPermission("life-imsec", "hostel-mess"), resetHostelMessDefaults);

/* =========================================================
   MULTER ERROR HANDLER
========================================================= */

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Each image must be smaller than 10 MB."
          : error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next();
});

export default router;
