import express from "express";

import {
  getDepartmentPlacement,
  getDepartmentPlacementBySlug,
  createDepartmentPlacement,
  updateDepartmentPlacement,
  deleteDepartmentPlacement,
} from "../controllers/departmentPlacementController.js";

import { protect } from "../middleware/authMiddleware.js";

import { requireDepartmentPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   GET PLACEMENT BY DEPARTMENT SLUG

   GET
   /api/department-placement/slug/:slug

   PUBLIC
========================================================= */

router.get("/slug/:slug", getDepartmentPlacementBySlug);

/* =========================================================
   GET PLACEMENT BY DEPARTMENT ID

   GET
   /api/department-placement/:departmentId

   ADMIN / SUB-ADMIN
   Permission:
   Department → Placement
========================================================= */

router.get(
  "/:departmentId",
  protect,
  requireDepartmentPermission("placement"),
  getDepartmentPlacement,
);

/* =========================================================
   CREATE PLACEMENT

   POST
   /api/department-placement

   Sub-Admin Permission:
   Department → Placement
========================================================= */

router.post(
  "/",
  protect,
  requireDepartmentPermission("placement"),
  createDepartmentPlacement,
);

/* =========================================================
   UPDATE PLACEMENT

   PUT
   /api/department-placement/:departmentId

   Sub-Admin Permission:
   Department → Placement
========================================================= */

router.put(
  "/:departmentId",
  protect,
  requireDepartmentPermission("placement"),
  updateDepartmentPlacement,
);

/* =========================================================
   DELETE PLACEMENT

   DELETE
   /api/department-placement/:departmentId

   Sub-Admin Permission:
   Department → Placement
========================================================= */

router.delete(
  "/:departmentId",
  protect,
  requireDepartmentPermission("placement"),
  deleteDepartmentPlacement,
);

export default router;
