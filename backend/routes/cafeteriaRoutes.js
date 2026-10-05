import express from "express";

import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import multer from "multer";
import path from "path";

import {
  getCafeteria,
  getCafeteriaAdmin,
  updateCafeteria,
  resetCafeteriaDefaults,
} from "../controllers/cafeteriaController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Multer Configuration
|--------------------------------------------------------------------------
*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const filename = `cafeteria-${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${extension}`;

    cb(null, filename);
  },
});

/*
|--------------------------------------------------------------------------
| File Filter
|--------------------------------------------------------------------------
*/

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed"), false);
  }
};

/*
|--------------------------------------------------------------------------
| Upload Middleware
|--------------------------------------------------------------------------
*/

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    files: 2,
  },
});

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTE
|--------------------------------------------------------------------------
| GET /api/cafeteria
|--------------------------------------------------------------------------
*/

router.get("/", getCafeteria);

/*
|--------------------------------------------------------------------------
| ADMIN ROUTE
|--------------------------------------------------------------------------
| GET /api/cafeteria/admin
|--------------------------------------------------------------------------
*/

router.get("/admin", protect,
  requireGlobalPermission("life-imsec", "cafeteria"), getCafeteriaAdmin);

/*
|--------------------------------------------------------------------------
| ADMIN UPDATE
|--------------------------------------------------------------------------
| PUT /api/cafeteria/admin
|
| Supported files:
| - heroImage
| - aboutImage
|--------------------------------------------------------------------------
*/

router.put("/admin", protect,
  requireGlobalPermission("life-imsec", "cafeteria"), upload.any(),
  validateUploadedFiles, updateCafeteria);

/*
|--------------------------------------------------------------------------
| ADMIN RESET
|--------------------------------------------------------------------------
| POST /api/cafeteria/admin/reset-defaults
|--------------------------------------------------------------------------
*/

router.post("/admin/reset-defaults", protect,
  requireGlobalPermission("life-imsec", "cafeteria"), resetCafeteriaDefaults);

/*
|--------------------------------------------------------------------------
| Multer Error Handler
|--------------------------------------------------------------------------
*/

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
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
