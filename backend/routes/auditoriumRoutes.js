import express from "express";

import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import multer from "multer";
import path from "path";

import {
  getAuditorium,
  getAuditoriumAdmin,
  updateAuditorium,
  resetAuditoriumDefaults,
} from "../controllers/auditoriumController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Multer Configuration
|--------------------------------------------------------------------------
| Images are temporarily stored in the local uploads folder.
| The controller then uploads them to Cloudinary.
|--------------------------------------------------------------------------
*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

/*
|--------------------------------------------------------------------------
| Allowed Image Types
|--------------------------------------------------------------------------
*/

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."), false);
  }
};

/*
|--------------------------------------------------------------------------
| Multer Upload
|--------------------------------------------------------------------------
*/

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per image
    files: 50,
  },
});

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

/*
 * GET /api/auditorium
 *
 * Public auditorium page
 */
router.get("/", getAuditorium);

/*
|--------------------------------------------------------------------------
| PROTECTED ADMIN ROUTES
|--------------------------------------------------------------------------
*/

/*
 * GET /api/auditorium/admin
 *
 * Admin dashboard fetch
 */
router.get("/admin", protect,
  requireGlobalPermission("life-imsec", "auditorium"), getAuditoriumAdmin);

/*
 * PUT /api/auditorium/admin
 *
 * Update auditorium content and upload images
 *
 * Supported image fields:
 *
 * heroImage
 * introductionImage
 * galleryImage_0
 * galleryImage_1
 * galleryImage_2
 * ...
 */
router.put("/admin", protect,
  requireGlobalPermission("life-imsec", "auditorium"), upload.any(),
  validateUploadedFiles, updateAuditorium);

/*
|--------------------------------------------------------------------------
| RESET DEFAULT DATA
|--------------------------------------------------------------------------
*/

/*
 * POST /api/auditorium/admin/reset-defaults
 *
 * Restores complete default Auditorium content.
 */
router.post("/admin/reset-defaults", protect,
  requireGlobalPermission("life-imsec", "auditorium"), resetAuditoriumDefaults);

/*
|--------------------------------------------------------------------------
| Multer Error Handler
|--------------------------------------------------------------------------
*/

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Image size must not exceed 10 MB.",
      });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many images uploaded.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
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
