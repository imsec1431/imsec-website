import express from "express";

import {
  getDepartmentResearchPatents,
  getDepartmentResearchPatentById,
  createDepartmentResearchPatent,
  updateDepartmentResearchPatent,
  deleteDepartmentResearchPatent,
} from "../controllers/departmentResearchPatentController.js";

import { protect } from "../middleware/authMiddleware.js";

import { requireDepartmentPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   GET ALL PATENTS FOR DEPARTMENT
   PUBLIC

   GET /api/department-research/patents/department/:departmentId
   ========================================================= */

router.get("/department/:departmentId", getDepartmentResearchPatents);

/* =========================================================
   GET SINGLE PATENT
   PUBLIC

   GET /api/department-research/patents/:id
   ========================================================= */

router.get("/:id", getDepartmentResearchPatentById);

/* =========================================================
   CREATE PATENT
   PROTECTED

   POST /api/department-research/patents

   Permission:
   Department → Research → Patents
   ========================================================= */

router.post(
  "/",
  protect,
  requireDepartmentPermission("research", "patents"),
  createDepartmentResearchPatent,
);

/* =========================================================
   UPDATE PATENT
   PROTECTED

   PUT /api/department-research/patents/:id

   Permission:
   Department → Research → Patents
   ========================================================= */

router.put(
  "/:id",
  protect,
  requireDepartmentPermission("research", "patents"),
  updateDepartmentResearchPatent,
);

/* =========================================================
   DELETE PATENT
   PROTECTED

   DELETE /api/department-research/patents/:id

   Permission:
   Department → Research → Patents
   ========================================================= */

router.delete(
  "/:id",
  protect,
  requireDepartmentPermission("research", "patents"),
  deleteDepartmentResearchPatent,
);

export default router;
