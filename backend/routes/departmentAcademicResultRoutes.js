import express from "express";

import {
  getAcademicResults,
  getAcademicResultsBySlug,
  createAcademicResults,
  updateAcademicResults,
  deleteAcademicResults,
} from "../controllers/departmentAcademicResultController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireDepartmentPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
   GET ACADEMIC RESULTS BY DEPARTMENT SLUG

   Example:
   /api/department-academic-results/slug/
   master-of-computer-application
========================================================= */

router.get("/slug/:slug", getAcademicResultsBySlug);

/* =========================================================
   GET ACADEMIC RESULTS BY DEPARTMENT ID

   Example:
   /api/department-academic-results/665abc...

   Permission:
   Department → Academic Results → Academic Results
========================================================= */

router.get(
  "/:departmentId",
  protect,
  requireDepartmentPermission("academic-results", "academic-results"),
  getAcademicResults,
);

/* =========================================================
   CREATE ACADEMIC RESULTS

   POST
   /api/department-academic-results

   Permission:
   Department → Academic Results → Academic Results
========================================================= */

router.post(
  "/",
  protect,
  requireDepartmentPermission("academic-results", "academic-results"),
  createAcademicResults,
);

/* =========================================================
   UPDATE ACADEMIC RESULTS

   PUT
   /api/department-academic-results/:departmentId

   Permission:
   Department → Academic Results → Academic Results
========================================================= */

router.put(
  "/:departmentId",
  protect,
  requireDepartmentPermission("academic-results", "academic-results"),
  updateAcademicResults,
);

/* =========================================================
   DELETE ACADEMIC RESULTS

   DELETE
   /api/department-academic-results/:departmentId

   Permission:
   Department → Academic Results → Academic Results
========================================================= */

router.delete(
  "/:departmentId",
  protect,
  requireDepartmentPermission("academic-results", "academic-results"),
  deleteAcademicResults,
);

export default router;
