import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import {
  getDepartmentInfrastructure,
  createDepartmentInfrastructure,
  updateDepartmentInfrastructure,
  addGalleryImage,
  deleteGalleryImage,
  deleteDepartmentInfrastructure,
} from "../controllers/departmentInfrastructureController.js";

import upload from "../middleware/multerMiddleware.js";

import { protect } from "../middleware/authMiddleware.js";

import { requireDepartmentPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   GET INFRASTRUCTURE
   GET /api/department-infrastructure/:departmentId

   PUBLIC
========================================================= */

router.get("/:departmentId", getDepartmentInfrastructure);

/* =========================================================
   CREATE INFRASTRUCTURE
   POST /api/department-infrastructure

   Sub-Admin Permission:
   Department
      ↓
   Infrastructure

   Files:
   - mainImage
   - highlightImages
========================================================= */

router.post(
  "/",
  protect,
  requireDepartmentPermission("infrastructure"),
  upload.fields([
    {
      name: "mainImage",
      maxCount: 1,
    },
    {
      name: "highlightImages",
      maxCount: 20,
    },
  ]),
  validateUploadedFiles,
  createDepartmentInfrastructure,
);

/* =========================================================
   UPDATE INFRASTRUCTURE
   PUT /api/department-infrastructure/:departmentId

   Sub-Admin Permission:
   Department
      ↓
   Infrastructure

   Files:
   - mainImage
   - highlightImages
========================================================= */

router.put(
  "/:departmentId",
  protect,
  requireDepartmentPermission("infrastructure"),
  upload.fields([
    {
      name: "mainImage",
      maxCount: 1,
    },
    {
      name: "highlightImages",
      maxCount: 20,
    },
  ]),
  validateUploadedFiles,
  updateDepartmentInfrastructure,
);

/* =========================================================
   ADD GALLERY IMAGE
   POST /api/department-infrastructure/:departmentId/gallery

   Sub-Admin Permission:
   Department
      ↓
   Infrastructure
========================================================= */

router.post(
  "/:departmentId/gallery",
  protect,
  requireDepartmentPermission("infrastructure"),
  upload.single("image"),
  validateUploadedFiles,
  addGalleryImage,
);

/* =========================================================
   DELETE GALLERY IMAGE
   DELETE
   /api/department-infrastructure/:departmentId/gallery/:galleryId

   Sub-Admin Permission:
   Department
      ↓
   Infrastructure
========================================================= */

router.delete(
  "/:departmentId/gallery/:galleryId",
  protect,
  requireDepartmentPermission("infrastructure"),
  deleteGalleryImage,
);

/* =========================================================
   DELETE COMPLETE INFRASTRUCTURE
   DELETE /api/department-infrastructure/:departmentId

   Sub-Admin Permission:
   Department
      ↓
   Infrastructure
========================================================= */

router.delete(
  "/:departmentId",
  protect,
  requireDepartmentPermission("infrastructure"),
  deleteDepartmentInfrastructure,
);

export default router;
