import express from "express";

import {
  getHodMessage,
  getHodMessageBySlug,
  createHodMessage,
  updateHodMessage,
  deleteHodMessage,
} from "../controllers/departmentHodMessageController.js";

import { protect } from "../middleware/authMiddleware.js";

import { requireDepartmentPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC — GET HOD MESSAGE BY DEPARTMENT SLUG

   GET
   /api/department-hod-message/slug/:slug
========================================================= */

router.get("/slug/:slug", getHodMessageBySlug);

/* =========================================================
   ADMIN / SUB-ADMIN — GET HOD MESSAGE BY DEPARTMENT

   GET
   /api/department-hod-message/department/:departmentId

   Permission:
   Department
      ↓
   Overview
      ↓
   HOD Message
========================================================= */

router.get(
  "/department/:departmentId",
  protect,
  requireDepartmentPermission("overview", "hod-message"),
  getHodMessage,
);

/* =========================================================
   CREATE HOD MESSAGE

   POST
   /api/department-hod-message

   Permission:
   Department
      ↓
   Overview
      ↓
   HOD Message
========================================================= */

router.post(
  "/",
  protect,
  requireDepartmentPermission("overview", "hod-message"),
  createHodMessage,
);

/* =========================================================
   UPDATE HOD MESSAGE

   PUT
   /api/department-hod-message/:id

   IMPORTANT:
   :id = HOD MESSAGE ID

   Middleware automatically resolves:

   HOD Message ID
        ↓
   Department ID
        ↓
   Sub Admin Permission
        ↓
   Overview
        ↓
   HOD Message
========================================================= */

router.put(
  "/:id",
  protect,
  requireDepartmentPermission("overview", "hod-message"),
  updateHodMessage,
);

/* =========================================================
   DELETE HOD MESSAGE

   DELETE
   /api/department-hod-message/:id

   :id = HOD MESSAGE ID
========================================================= */

router.delete(
  "/:id",
  protect,
  requireDepartmentPermission("overview", "hod-message"),
  deleteHodMessage,
);

export default router;
