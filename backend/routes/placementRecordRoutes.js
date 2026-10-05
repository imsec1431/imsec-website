import express from "express";

import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import multer from "multer";

import {
  getPublicPlacementStudents,
  getAllPlacementStudents,
  createPlacementStudent,
  importPlacementStudentsFromExcel,
  updatePlacementStudent,
  deletePlacementStudent,
} from "../controllers/placementRecordController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   MULTER - EXCEL UPLOAD
========================================================= */

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },

  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".xlsx", ".xls"];

    const fileName = file.originalname || "";

    const extension = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();

    if (allowedExtensions.includes(extension)) {
      cb(null, true);
    } else {
      cb(new Error("Only Excel files (.xlsx or .xls) are allowed."));
    }
  },
});

/* =========================================================
   PUBLIC ROUTE
========================================================= */

router.get("/public", getPublicPlacementStudents);

/* =========================================================
   ADMIN ROUTES
========================================================= */

/*
  Get all placement records
*/

router.get("/", protect,
  requireGlobalPermission("placements", "placement-record"), getAllPlacementStudents);

/*
  Add single student
*/

router.post("/", protect,
  requireGlobalPermission("placements", "placement-record"), createPlacementStudent);

/*
  IMPORT MULTIPLE STUDENTS FROM EXCEL

  Excel file field name:
  "file"
*/

router.post(
  "/import-excel",
  protect,
  requireGlobalPermission("placements", "placement-record"),
  upload.single("file"),
  validateUploadedFiles,
  importPlacementStudentsFromExcel,
);

/*
  Update student
*/

router.put("/:id", protect,
  requireGlobalPermission("placements", "placement-record"), updatePlacementStudent);

/*
  Delete student
*/

router.delete("/:id", protect,
  requireGlobalPermission("placements", "placement-record"), deletePlacementStudent);

export default router;
