import express from "express";

import {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getActiveDepartments,
  getDepartmentBySlug,
} from "../controllers/departmentController.js";

import { protect } from "../middleware/authMiddleware.js";

import {
  requireGlobalPermission,
  requireDepartmentPermission,
} from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   GET ALL DEPARTMENTS

   GET /api/departments

   Admin / Sub-Admin
   Global Permission:
   Departments → Overview
========================================================= */

router.get(
  "/",
  protect,
  requireGlobalPermission("departments", "overview"),
  getDepartments,
);

/* =========================================================
   PUBLIC ACTIVE DEPARTMENTS

   GET /api/departments/public

   PUBLIC
========================================================= */

router.get("/public", getActiveDepartments);

/* =========================================================
   GET DEPARTMENT BY SLUG

   GET /api/departments/slug/:slug

   PUBLIC
========================================================= */

router.get("/slug/:slug", getDepartmentBySlug);

/* =========================================================
   GET SINGLE DEPARTMENT

   GET /api/departments/:id

   Admin / Sub-Admin
   Global Permission:
   Departments → Overview
========================================================= */

router.get(
  "/:id",
  protect,
  requireGlobalPermission("departments", "overview"),
  getDepartment,
);

/* =========================================================
   CREATE DEPARTMENT

   POST /api/departments

   Admin only / authorized admin

   Global Permission:
   Departments → Add
========================================================= */

router.post(
  "/",
  protect,
  requireGlobalPermission("departments", "add"),
  createDepartment,
);

/* =========================================================
   UPDATE DEPARTMENT

   PUT /api/departments/:id

   Global Permission:
   Departments → Edit
========================================================= */

router.put(
  "/:id",
  protect,
  requireGlobalPermission("departments", "edit"),
  updateDepartment,
);

/* =========================================================
   DELETE DEPARTMENT

   DELETE /api/departments/:id

   Global Permission:
   Departments → Edit

   NOTE:
   Delete is controlled using the Edit permission because
   the current permission configuration does not have a
   separate Delete sub-module.
========================================================= */

router.delete(
  "/:id",
  protect,
  requireGlobalPermission("departments", "edit"),
  deleteDepartment,
);

export default router;
