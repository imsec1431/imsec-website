import express from "express";

import {
  getDepartmentResearchPolicy,
  getDepartmentResearchPolicyById,
  createDepartmentResearchPolicy,
  updateDepartmentResearchPolicy,
  deleteDepartmentResearchPolicy,
} from "../controllers/departmentResearchPolicyController.js";

import { protect } from "../middleware/authMiddleware.js";

import { requireDepartmentPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   GET RESEARCH POLICY BY DEPARTMENT
   PUBLIC

   GET /api/department-research/policy/department/:departmentId
   ========================================================= */

router.get("/department/:departmentId", getDepartmentResearchPolicy);

/* =========================================================
   GET RESEARCH POLICY BY ID
   PUBLIC

   GET /api/department-research/policy/:id
   ========================================================= */

router.get("/:id", getDepartmentResearchPolicyById);

/* =========================================================
   CREATE RESEARCH POLICY
   PROTECTED

   POST /api/department-research/policy

   Permission:
   Department → Research → Research Policy
   ========================================================= */

router.post(
  "/",
  protect,
  requireDepartmentPermission("research", "research-policy"),
  createDepartmentResearchPolicy,
);

/* =========================================================
   UPDATE RESEARCH POLICY
   PROTECTED

   PUT /api/department-research/policy/:id

   Permission:
   Department → Research → Research Policy
   ========================================================= */

router.put(
  "/:id",
  protect,
  requireDepartmentPermission("research", "research-policy"),
  updateDepartmentResearchPolicy,
);

/* =========================================================
   DELETE RESEARCH POLICY
   PROTECTED

   DELETE /api/department-research/policy/:id

   Permission:
   Department → Research → Research Policy
   ========================================================= */

router.delete(
  "/:id",
  protect,
  requireDepartmentPermission("research", "research-policy"),
  deleteDepartmentResearchPolicy,
);

export default router;
