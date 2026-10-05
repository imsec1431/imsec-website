import express from "express";
import mongoose from "mongoose";

import {
  getStudentCorner,
  createStudentCorner,
  updateStudentCorner,
  deleteStudentCorner,
} from "../controllers/studentCornerController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireDepartmentPermission } from "../middleware/permissionMiddleware.js";

import Department from "../models/Department.js";

const router = express.Router();

/* =========================================================
   RESOLVE DEPARTMENT
   Supports both:
   - MongoDB ObjectId
   - Department slug
========================================================= */

const resolveStudentCornerDepartment = async (req, res, next) => {
  try {
    const departmentValue =
      req.params.departmentId ||
      req.params.slug ||
      req.body?.departmentId ||
      req.query?.departmentId ||
      null;

    if (!departmentValue) {
      return res.status(400).json({
        success: false,
        message: "Department is required",
      });
    }

    let department = null;

    // Check ObjectId
    if (mongoose.Types.ObjectId.isValid(departmentValue)) {
      department =
        await Department.findById(departmentValue).select("_id name slug");
    }

    // Check slug
    if (!department) {
      department = await Department.findOne({
        slug: departmentValue,
      }).select("_id name slug");
    }

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    /*
     * Store resolved department information
     * so the controller can also use it if required.
     */
    req.resolvedDepartment = department;
    req.departmentId = department._id;
    req.departmentSlug = department.slug;

    /*
     * Replace route parameter with the actual
     * MongoDB ObjectId.
     *
     * This is important because some existing
     * Student Corner controller methods expect
     * departmentId.
     */
    if (req.params.departmentId) {
      req.params.departmentId = department._id.toString();
    }

    next();
  } catch (error) {
    console.error("Student Corner department resolver error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to resolve department",
    });
  }
};

/* =========================================================
   GET STUDENT CORNER
   PUBLIC
========================================================= */

router.get("/:departmentId", getStudentCorner);

/* =========================================================
   CREATE STUDENT CORNER
   SUB ADMIN PERMISSION:
   Department → Student Corner
========================================================= */

router.post(
  "/",
  protect,
  resolveStudentCornerDepartment,
  requireDepartmentPermission("student-corner"),
  createStudentCorner,
);

/* =========================================================
   UPDATE STUDENT CORNER
   SUB ADMIN PERMISSION:
   Department → Student Corner
========================================================= */

router.put(
  "/:departmentId",
  protect,
  resolveStudentCornerDepartment,
  requireDepartmentPermission("student-corner"),
  updateStudentCorner,
);

/* =========================================================
   DELETE STUDENT CORNER
   SUB ADMIN PERMISSION:
   Department → Student Corner
========================================================= */

router.delete(
  "/:departmentId",
  protect,
  resolveStudentCornerDepartment,
  requireDepartmentPermission("student-corner"),
  deleteStudentCorner,
);

export default router;
