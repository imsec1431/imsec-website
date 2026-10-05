import express from "express";

import {
  getDepartmentResearchConferencePapers,
  getDepartmentResearchConferencePaperById,
  createDepartmentResearchConferencePaper,
  updateDepartmentResearchConferencePaper,
  deleteDepartmentResearchConferencePaper,
} from "../controllers/departmentResearchConferencePaperController.js";

import { protect } from "../middleware/authMiddleware.js";

import { requireDepartmentPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   GET CONFERENCE PAPERS BY DEPARTMENT
   PUBLIC

   GET /api/department-research/conference-papers/department/:departmentId
   ========================================================= */

router.get("/department/:departmentId", getDepartmentResearchConferencePapers);

/* =========================================================
   GET CONFERENCE PAPER BY ID
   PUBLIC

   GET /api/department-research/conference-papers/:id
   ========================================================= */

router.get("/:id", getDepartmentResearchConferencePaperById);

/* =========================================================
   CREATE CONFERENCE PAPER
   PROTECTED

   POST /api/department-research/conference-papers

   Permission:
   Department → Research → Conference Papers
   ========================================================= */

router.post(
  "/",
  protect,
  requireDepartmentPermission("research", "conference-papers"),
  createDepartmentResearchConferencePaper,
);

/* =========================================================
   UPDATE CONFERENCE PAPER
   PROTECTED

   PUT /api/department-research/conference-papers/:id

   Permission:
   Department → Research → Conference Papers
   ========================================================= */

router.put(
  "/:id",
  protect,
  requireDepartmentPermission("research", "conference-papers"),
  updateDepartmentResearchConferencePaper,
);

/* =========================================================
   DELETE CONFERENCE PAPER
   PROTECTED

   DELETE /api/department-research/conference-papers/:id

   Permission:
   Department → Research → Conference Papers
   ========================================================= */

router.delete(
  "/:id",
  protect,
  requireDepartmentPermission("research", "conference-papers"),
  deleteDepartmentResearchConferencePaper,
);

export default router;
