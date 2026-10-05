import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import {
  getAllTeachingLearningProcesses,
  getPublishedTeachingLearningProcesses,
  getTeachingLearningProcessById,
  createTeachingLearningProcess,
  updateTeachingLearningProcess,
  deleteTeachingLearningProcess,
  toggleTeachingLearningProcessStatus,
} from "../controllers/teachingLearningProcessController.js";

import { protect } from "../middleware/authMiddleware.js";

import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
   GET /api/teaching-learning-process
========================================================= */

router.get("/", getPublishedTeachingLearningProcesses);

/* =========================================================
   ADMIN — GET ALL
   GET /api/teaching-learning-process/admin

   Permission:
   Academics → Teaching Learning Process
========================================================= */

router.get(
  "/admin",
  protect,
  requireGlobalPermission("academics", "teaching-learning-process"),
  getAllTeachingLearningProcesses,
);

/* =========================================================
   ADMIN — GET SINGLE
   GET /api/teaching-learning-process/admin/:id

   Permission:
   Academics → Teaching Learning Process
========================================================= */

router.get(
  "/admin/:id",
  protect,
  requireGlobalPermission("academics", "teaching-learning-process"),
  getTeachingLearningProcessById,
);

/* =========================================================
   ADMIN — CREATE
   POST /api/teaching-learning-process/admin

   multipart/form-data

   image
   displayOrder
   isPublished

   Permission:
   Academics → Teaching Learning Process
========================================================= */

router.post(
  "/admin",
  protect,
  requireGlobalPermission("academics", "teaching-learning-process"),
  upload.single("image"),
  validateUploadedFiles,
  createTeachingLearningProcess,
);

/* =========================================================
   ADMIN — UPDATE
   PUT /api/teaching-learning-process/admin/:id

   Permission:
   Academics → Teaching Learning Process
========================================================= */

router.put(
  "/admin/:id",
  protect,
  requireGlobalPermission("academics", "teaching-learning-process"),
  upload.single("image"),
  validateUploadedFiles,
  updateTeachingLearningProcess,
);

/* =========================================================
   ADMIN — DELETE
   DELETE /api/teaching-learning-process/admin/:id

   Permission:
   Academics → Teaching Learning Process
========================================================= */

router.delete(
  "/admin/:id",
  protect,
  requireGlobalPermission("academics", "teaching-learning-process"),
  deleteTeachingLearningProcess,
);

/* =========================================================
   ADMIN — STATUS
   PATCH /api/teaching-learning-process/admin/:id/status

   Permission:
   Academics → Teaching Learning Process
========================================================= */

router.patch(
  "/admin/:id/status",
  protect,
  requireGlobalPermission("academics", "teaching-learning-process"),
  toggleTeachingLearningProcessStatus,
);

export default router;
