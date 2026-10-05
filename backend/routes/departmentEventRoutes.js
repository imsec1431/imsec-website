import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import {
  createDepartmentEvent,
  getDepartmentEvents,
  getDepartmentEventById,
  updateDepartmentEvent,
  deleteDepartmentEvent,
  getPublicDepartmentEvents,
} from "../controllers/departmentEventController.js";

import upload from "../middleware/multerMiddleware.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireDepartmentPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   CREATE DEPARTMENT EVENT

   POST
   /api/department-events

   Permission:
   Departments → Events
========================================================= */

router.post(
  "/",
  protect,
  requireDepartmentPermission("department-events", "events"),
  upload.single("image"),
  validateUploadedFiles,
  createDepartmentEvent,
);

/* =========================================================
   PUBLIC EVENTS BY DEPARTMENT SLUG

   GET
   /api/department-events/slug/:slug

   PUBLIC
========================================================= */

router.get("/slug/:slug", getPublicDepartmentEvents);

/* =========================================================
   GET ALL EVENTS BY DEPARTMENT

   GET
   /api/department-events/department/:departmentId

   Permission:
   Departments → Events
========================================================= */

router.get(
  "/department/:departmentId",
  protect,
  requireDepartmentPermission("department-events", "events"),
  getDepartmentEvents,
);

/* =========================================================
   GET SINGLE EVENT

   GET
   /api/department-events/:id

   PUBLIC
========================================================= */

router.get("/:id", getDepartmentEventById);

/* =========================================================
   UPDATE DEPARTMENT EVENT

   PUT
   /api/department-events/:id

   :id = Department Event ID

   Permission:
   Departments → Events
========================================================= */

router.put(
  "/:id",
  protect,
  requireDepartmentPermission("department-events", "events"),
  upload.single("image"),
  validateUploadedFiles,
  updateDepartmentEvent,
);

/* =========================================================
   DELETE DEPARTMENT EVENT

   DELETE
   /api/department-events/:id

   :id = Department Event ID

   Permission:
   Departments → Events
========================================================= */

router.delete(
  "/:id",
  protect,
  requireDepartmentPermission("department-events", "events"),
  deleteDepartmentEvent,
);

export default router;
