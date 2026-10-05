import express from "express";

import {
  getDepartmentResearchFDPs,
  getDepartmentResearchFDPById,
  createDepartmentResearchFDP,
  updateDepartmentResearchFDP,
  deleteDepartmentResearchFDP,
} from "../controllers/departmentResearchFDPController.js";

import { protect } from "../middleware/authMiddleware.js";

import { requireDepartmentPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   GET ALL FDPs BY DEPARTMENT
   PUBLIC

   GET /api/department-research/fdps/department/:departmentId
   ========================================================= */

router.get("/department/:departmentId", getDepartmentResearchFDPs);

/* =========================================================
   GET SINGLE FDP
   PUBLIC

   GET /api/department-research/fdps/:id
   ========================================================= */

router.get("/:id", getDepartmentResearchFDPById);

/* =========================================================
   CREATE FDP
   PROTECTED

   POST /api/department-research/fdps

   Permission:
   Department → Research → FDPs
   ========================================================= */

router.post(
  "/",
  protect,
  requireDepartmentPermission("research", "fdps"),
  createDepartmentResearchFDP,
);

/* =========================================================
   UPDATE FDP
   PROTECTED

   PUT /api/department-research/fdps/:id

   Permission:
   Department → Research → FDPs
   ========================================================= */

router.put(
  "/:id",
  protect,
  requireDepartmentPermission("research", "fdps"),
  updateDepartmentResearchFDP,
);

/* =========================================================
   DELETE FDP
   PROTECTED

   DELETE /api/department-research/fdps/:id

   Permission:
   Department → Research → FDPs
   ========================================================= */

router.delete(
  "/:id",
  protect,
  requireDepartmentPermission("research", "fdps"),
  deleteDepartmentResearchFDP,
);

export default router;
