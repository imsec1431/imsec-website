import express from "express";

import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";

import {
  getDepartmentOverview,
  getDepartmentOverviewBySlug,
  createDepartmentOverview,
  updateDepartmentOverview,
  deleteDepartmentOverview,
  uploadOverviewImage,
  deleteOverviewImage,
  uploadDepartmentGalleryImage,
  deleteDepartmentGalleryImage,
} from "../controllers/departmentOverviewController.js";

import upload from "../middleware/multerMiddleware.js";

import { protect } from "../middleware/authMiddleware.js";

import { requireDepartmentPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   GET DEPARTMENT OVERVIEW BY SLUG

   GET
   /api/department-overview/slug/:slug

   PUBLIC
========================================================= */

router.get("/slug/:slug", getDepartmentOverviewBySlug);

/* =========================================================
   GET DEPARTMENT OVERVIEW BY DEPARTMENT ID

   GET
   /api/department-overview/:departmentId

   ADMIN / SUB-ADMIN
   Permission:
   Department → Overview
========================================================= */

router.get(
  "/:departmentId",
  protect,
  requireDepartmentPermission("overview"),
  getDepartmentOverview,
);

/* =========================================================
   CREATE DEPARTMENT OVERVIEW

   POST
   /api/department-overview

   Permission:
   Department → Overview
========================================================= */

router.post(
  "/",
  protect,
  requireDepartmentPermission("overview"),
  createDepartmentOverview,
);

/* =========================================================
   UPDATE DEPARTMENT OVERVIEW

   PUT
   /api/department-overview/:departmentId

   Permission:
   Department → Overview
========================================================= */

router.put(
  "/:departmentId",
  protect,
  requireDepartmentPermission("overview"),
  updateDepartmentOverview,
);

/* =========================================================
   DELETE DEPARTMENT OVERVIEW

   DELETE
   /api/department-overview/:departmentId

   Permission:
   Department → Overview
========================================================= */

router.delete(
  "/:departmentId",
  protect,
  requireDepartmentPermission("overview"),
  deleteDepartmentOverview,
);

/* =========================================================
   UPLOAD MAIN OVERVIEW IMAGE

   POST
   /api/department-overview/:departmentId/overview-image

   Permission:
   Department → Overview
========================================================= */

router.post(
  "/:departmentId/overview-image",
  protect,
  requireDepartmentPermission("overview"),
  upload.single("file"),
  validateUploadedFiles,
  uploadOverviewImage,
);

/* =========================================================
   DELETE MAIN OVERVIEW IMAGE

   DELETE
   /api/department-overview/:departmentId/overview-image

   Permission:
   Department → Overview
========================================================= */

router.delete(
  "/:departmentId/overview-image",
  protect,
  requireDepartmentPermission("overview"),
  deleteOverviewImage,
);

/* =========================================================
   UPLOAD DEPARTMENT GALLERY IMAGE

   POST
   /api/department-overview/:departmentId/gallery

   Permission:
   Department → Overview
========================================================= */

router.post(
  "/:departmentId/gallery",
  protect,
  requireDepartmentPermission("overview"),
  upload.single("file"),
  validateUploadedFiles,
  uploadDepartmentGalleryImage,
);

/* =========================================================
   OPTIONAL GALLERY UPLOAD COMPATIBILITY ROUTE

   POST
   /api/department-overview/:departmentId/gallery/image

   This supports frontend code that uses /gallery/image
========================================================= */

router.post(
  "/:departmentId/gallery/image",
  protect,
  requireDepartmentPermission("overview"),
  upload.single("file"),
  validateUploadedFiles,
  uploadDepartmentGalleryImage,
);

/* =========================================================
   DELETE DEPARTMENT GALLERY IMAGE

   DELETE
   /api/department-overview/:departmentId/gallery/image

   Body:
   {
     "publicId": "cloudinary-public-id"
   }

   Permission:
   Department → Overview
========================================================= */

router.delete(
  "/:departmentId/gallery/image",
  protect,
  requireDepartmentPermission("overview"),
  deleteDepartmentGalleryImage,
);

export default router;
