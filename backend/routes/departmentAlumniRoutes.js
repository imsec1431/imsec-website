import express from "express";

import {
  getDepartmentAlumni,
  getDepartmentAlumniById,
  createDepartmentAlumni,
  updateDepartmentAlumni,
  deleteDepartmentAlumni,
} from "../controllers/departmentAlumniController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireDepartmentPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   DEPARTMENT ALUMNI
========================================================= */

/*
   GET
   /api/department-alumni/department/:departmentId

   ADMIN / SUB ADMIN
   Permission:
   Departments → Department Alumni
*/
router.get(
  "/department/:departmentId",

  getDepartmentAlumni,
);

/*
   GET
   /api/department-alumni/:id

   ADMIN / SUB ADMIN
   Permission:
   Departments → Department Alumni

   The middleware resolves the alumni record's
   department from its ID.
*/
router.get(
  "/:id",
  protect,
  requireDepartmentPermission("alumni"),
  getDepartmentAlumniById,
);

/*
   POST
   /api/department-alumni

   ADMIN / SUB ADMIN
   Permission:
   Departments → Department Alumni
*/
router.post(
  "/",
  protect,
  requireDepartmentPermission("alumni"),
  createDepartmentAlumni,
);

/*
   PUT
   /api/department-alumni/:id

   ADMIN / SUB ADMIN
   Permission:
   Departments → Department Alumni
*/
router.put(
  "/:id",
  protect,
  requireDepartmentPermission("alumni"),
  updateDepartmentAlumni,
);

/*
   DELETE
   /api/department-alumni/:id

   ADMIN / SUB ADMIN
   Permission:
   Departments → Department Alumni
*/
router.delete(
  "/:id",
  protect,
  requireDepartmentPermission("alumni"),
  deleteDepartmentAlumni,
);

export default router;
