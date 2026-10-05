import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import {
  createEmployeeGrievance,
  getAllEmployeeGrievances,
  getEmployeeGrievanceById,
  updateEmployeeGrievance,
  deleteEmployeeGrievance,
} from "../controllers/employeeGrievanceController.js";

import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

/* ===========================================
   Employee Grievance Routes
=========================================== */

// Submit Employee Grievance
router.post("/", upload.single("attachment"),
  validateUploadedFiles, createEmployeeGrievance);

// Get All Employee Grievances
router.get("/", protect, requireGlobalPermission("grievance", "employee-grievance"), getAllEmployeeGrievances);

// Get Single Employee Grievance
router.get("/:id", protect, requireGlobalPermission("grievance", "employee-grievance"), getEmployeeGrievanceById);

// Update Status / Remarks
router.put("/:id", protect, requireGlobalPermission("grievance", "employee-grievance"), updateEmployeeGrievance);

// Delete Employee Grievance
router.delete("/:id", protect, requireGlobalPermission("grievance", "employee-grievance"), deleteEmployeeGrievance);

export default router;
