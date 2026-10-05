import express from "express";

import {
  getDepartmentResearchBooks,
  getDepartmentResearchBookById,
  createDepartmentResearchBook,
  updateDepartmentResearchBook,
  deleteDepartmentResearchBook,
} from "../controllers/departmentResearchBookController.js";

import { protect } from "../middleware/authMiddleware.js";

import { requireDepartmentPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   GET ALL BOOKS / CHAPTERS FOR DEPARTMENT
   PUBLIC
   ========================================================= */

router.get("/department/:departmentId", getDepartmentResearchBooks);

/* =========================================================
   GET SINGLE BOOK / CHAPTER
   PUBLIC
   ========================================================= */

router.get("/:id", getDepartmentResearchBookById);

/* =========================================================
   CREATE BOOK / CHAPTER
   PROTECTED

   Permission:
   Department → Research → Books / Chapters
   ========================================================= */

router.post(
  "/",
  protect,
  requireDepartmentPermission("research", "books-chapters"),
  createDepartmentResearchBook,
);

/* =========================================================
   UPDATE BOOK / CHAPTER
   PROTECTED

   Permission:
   Department → Research → Books / Chapters
   ========================================================= */

router.put(
  "/:id",
  protect,
  requireDepartmentPermission("research", "books-chapters"),
  updateDepartmentResearchBook,
);

/* =========================================================
   DELETE BOOK / CHAPTER
   PROTECTED

   Permission:
   Department → Research → Books / Chapters
   ========================================================= */

router.delete(
  "/:id",
  protect,
  requireDepartmentPermission("research", "books-chapters"),
  deleteDepartmentResearchBook,
);

export default router;
