import express from "express";

import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import multer from "multer";

import {
  getPublishedCareerOpenings,
  getCareerOpeningById,
  getAllCareerOpenings,
  createCareerOpening,
  updateCareerOpening,
  deleteCareerOpening,
  submitCareerApplication,
  getCareerApplications,
  getCareerApplicationById,
  exportCareerApplicationsExcel,
  downloadCareerApplicationResume,
} from "../controllers/careerController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

// ======================================================
// ROUTER
// ======================================================

const router = express.Router();

// ======================================================
// MULTER
// ======================================================

const storage = multer.diskStorage({});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC and DOCX files are allowed."), false);
    }
  },
});

// ======================================================
// PUBLIC
// ======================================================

// Get published career openings
router.get("/", getPublishedCareerOpenings);

// Get single published career opening
router.get("/:id", getCareerOpeningById);

// Submit career application
// This MUST remain public.
router.post(
  "/:openingId/apply",
  upload.single("resumeFile"),
  validateUploadedFiles,
  submitCareerApplication,
);

// ======================================================
// ADMIN / SUB ADMIN
// Permission:
// Website Content → Careers
// ======================================================

// Get all career openings
router.get(
  "/admin/openings",
  protect,
  requireGlobalPermission("website-content", "careers"),
  getAllCareerOpenings,
);

// Create career opening
router.post(
  "/admin/openings",
  protect,
  requireGlobalPermission("website-content", "careers"),
  createCareerOpening,
);

// Update career opening
router.put(
  "/admin/openings/:id",
  protect,
  requireGlobalPermission("website-content", "careers"),
  updateCareerOpening,
);

// Delete career opening
router.delete(
  "/admin/openings/:id",
  protect,
  requireGlobalPermission("website-content", "careers"),
  deleteCareerOpening,
);

// ======================================================
// ADMIN / SUB ADMIN — APPLICATIONS
// Permission:
// Website Content → Careers
// ======================================================

// Get all career applications
router.get(
  "/admin/applications",
  protect,
  requireGlobalPermission("website-content", "careers"),
  getCareerApplications,
);

// Export career applications
router.get(
  "/admin/applications/export",
  protect,
  requireGlobalPermission("website-content", "careers"),
  exportCareerApplicationsExcel,
);

// Download candidate resume
router.get(
  "/admin/applications/:id/resume",
  protect,
  requireGlobalPermission("website-content", "careers"),
  downloadCareerApplicationResume,
);

// Get single career application
router.get(
  "/admin/applications/:id",
  protect,
  requireGlobalPermission("website-content", "careers"),
  getCareerApplicationById,
);

// ======================================================
// ERROR HANDLER FOR MULTER
// ======================================================

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "CV / Resume size must not exceed 5 MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error?.message?.toLowerCase().includes("only pdf")) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
});

// ======================================================
// EXPORT
// ======================================================

export default router;
