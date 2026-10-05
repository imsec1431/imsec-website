import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import {
  getAllDepartmentFaculty,
  getDepartmentFaculty,
  getDepartmentFacultyBySlug,
  getFaculty,
  createDepartmentFaculty,
  updateDepartmentFaculty,
  deleteDepartmentFaculty,
} from "../controllers/departmentFacultyController.js";

import upload from "../middleware/multerMiddleware.js";

import { protect } from "../middleware/authMiddleware.js";

import { requireDepartmentPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC — GET ALL FACULTY
========================================================= */

router.get("/", getAllDepartmentFaculty);

/* =========================================================
   PUBLIC — GET FACULTY BY DEPARTMENT SLUG
=========================================================

   Example:

   GET
   /api/department-faculty/slug/master-of-computer-application

   IMPORTANT:
   NO protect middleware
   NO permission middleware

   This endpoint is ONLY for the public website.
========================================================= */

router.get("/slug/:slug", getDepartmentFacultyBySlug);

/* =========================================================
   ADMIN / SUB ADMIN — GET FACULTY BY DEPARTMENT ID
=========================================================

   Example:

   GET
   /api/department-faculty/department/XXXXXXXX

   Permission:

   Department
       ↓
   Faculty
       ↓
   Faculty List
========================================================= */

router.get(
  "/department/:departmentId",
  protect,
  requireDepartmentPermission("faculty", "faculty-list"),
  getDepartmentFaculty,
);

/* =========================================================
   PUBLIC — GET SINGLE FACULTY
========================================================= */

router.get("/single/:id", getFaculty);

/* =========================================================
   ADMIN / SUB ADMIN — CREATE FACULTY
========================================================= */

router.post(
  "/",
  protect,
  requireDepartmentPermission("faculty", "faculty-list"),
  upload.single("photo"),
  validateUploadedFiles,
  createDepartmentFaculty,
);

/* =========================================================
   ADMIN / SUB ADMIN — UPDATE FACULTY
=========================================================

   :id = FACULTY ID

   Permission middleware resolves:

   Faculty ID
        ↓
   Department ID
        ↓
   Sub Admin Department
        ↓
   Faculty
        ↓
   Faculty List
========================================================= */

router.put(
  "/:id",
  protect,
  requireDepartmentPermission("faculty", "faculty-list"),
  upload.single("photo"),
  validateUploadedFiles,
  updateDepartmentFaculty,
);

/* =========================================================
   ADMIN / SUB ADMIN — DELETE FACULTY
========================================================= */

router.delete(
  "/:id",
  protect,
  requireDepartmentPermission("faculty", "faculty-list"),
  deleteDepartmentFaculty,
);

export default router;
