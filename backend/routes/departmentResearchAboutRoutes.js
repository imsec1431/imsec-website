import express from "express";

import {
  getDepartmentResearchAbout,
  getDepartmentResearchAboutById,
  createDepartmentResearchAbout,
  updateDepartmentResearchAbout,
  deleteDepartmentResearchAbout,
} from "../controllers/departmentResearchAboutController.js";

import { protect } from "../middleware/authMiddleware.js";

import { requireDepartmentPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   GET RESEARCH ABOUT BY DEPARTMENT
   Public API

   GET /api/department-research/about/department/:departmentId
   ========================================================= */

router.get("/department/:departmentId", getDepartmentResearchAbout);

/* =========================================================
   GET RESEARCH ABOUT BY ID
   Public API

   GET /api/department-research/about/:id
   ========================================================= */

router.get("/:id", getDepartmentResearchAboutById);

/* =========================================================
   CREATE RESEARCH ABOUT
   Protected

   POST /api/department-research/about

   Permission:
   Department → Research → About
   ========================================================= */

router.post(
  "/",
  protect,
  requireDepartmentPermission("research", "about"),
  createDepartmentResearchAbout,
);

/* =========================================================
   UPDATE RESEARCH ABOUT
   Protected

   PUT /api/department-research/about/:id

   Permission:
   Department → Research → About
   ========================================================= */

router.put(
  "/:id",
  protect,
  requireDepartmentPermission("research", "about"),
  updateDepartmentResearchAbout,
);

/* =========================================================
   DELETE RESEARCH ABOUT
   Protected

   DELETE /api/department-research/about/:id

   Permission:
   Department → Research → About
   ========================================================= */

router.delete(
  "/:id",
  protect,
  requireDepartmentPermission("research", "about"),
  deleteDepartmentResearchAbout,
);

export default router;
