import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

import {
  createStudentGrievance,
  getAllStudentGrievances,
  getStudentGrievanceById,
  updateStudentGrievance,
  deleteStudentGrievance,
} from "../controllers/studentGrievanceController.js";

const router = express.Router();

/* ======================================================
   Student Grievance Routes
====================================================== */

// Create Complaint
router.post("/", upload.single("attachment"),
  validateUploadedFiles, createStudentGrievance);

// Get All Complaints
router.get("/", protect, requireGlobalPermission("grievance", "student-grievance"), getAllStudentGrievances);

// Get Single Complaint
router.get("/:id", protect, requireGlobalPermission("grievance", "student-grievance"), getStudentGrievanceById);

// Update Complaint (Status / Remarks)
router.put("/:id", protect, requireGlobalPermission("grievance", "student-grievance"), updateStudentGrievance);

// Delete Complaint
router.delete("/:id", protect, requireGlobalPermission("grievance", "student-grievance"), deleteStudentGrievance);

export default router;
