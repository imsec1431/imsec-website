import express from "express";

import {
  getDepartmentResearchJournals,
  getDepartmentResearchJournalById,
  createDepartmentResearchJournal,
  updateDepartmentResearchJournal,
  deleteDepartmentResearchJournal,
} from "../controllers/departmentResearchJournalController.js";

import { protect } from "../middleware/authMiddleware.js";

import { requireDepartmentPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   GET JOURNALS BY DEPARTMENT
   PUBLIC

   GET /api/department-research/journals/department/:departmentId
   ========================================================= */

router.get("/department/:departmentId", getDepartmentResearchJournals);

/* =========================================================
   GET JOURNAL BY ID
   PUBLIC

   GET /api/department-research/journals/:id
   ========================================================= */

router.get("/:id", getDepartmentResearchJournalById);

/* =========================================================
   CREATE JOURNAL
   PROTECTED

   POST /api/department-research/journals

   Permission:
   Department → Research → Journals
   ========================================================= */

router.post(
  "/",
  protect,
  requireDepartmentPermission("research", "journals"),
  createDepartmentResearchJournal,
);

/* =========================================================
   UPDATE JOURNAL
   PROTECTED

   PUT /api/department-research/journals/:id

   Permission:
   Department → Research → Journals
   ========================================================= */

router.put(
  "/:id",
  protect,
  requireDepartmentPermission("research", "journals"),
  updateDepartmentResearchJournal,
);

/* =========================================================
   DELETE JOURNAL
   PROTECTED

   DELETE /api/department-research/journals/:id

   Permission:
   Department → Research → Journals
   ========================================================= */

router.delete(
  "/:id",
  protect,
  requireDepartmentPermission("research", "journals"),
  deleteDepartmentResearchJournal,
);

export default router;
