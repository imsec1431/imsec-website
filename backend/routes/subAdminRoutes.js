import express from "express";

import {
  createSubAdmin,
  getSubAdmins,
  getSubAdmin,
  updateSubAdmin,
  updateSubAdminPermissions,
  resetSubAdminPassword,
  toggleSubAdminStatus,
  deleteSubAdmin,
  getPermissionConfig,
} from "../controllers/subAdminController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const requireMainAdmin = (req, res, next) => {
  if (req.admin?.role === "Sub Admin") {
    return res.status(403).json({
      success: false,
      message: "Only an Admin can manage Sub Admin accounts.",
    });
  }

  next();
};

/* =========================================================
   SUB-ADMIN MANAGEMENT

   All routes require an authenticated Admin.
========================================================= */

/* =========================================================
   GET PERMISSION CONFIG

   GET /api/sub-admins/permission-config
========================================================= */

router.get("/permission-config", protect, requireMainAdmin, getPermissionConfig);

/* =========================================================
   CREATE SUB ADMIN

   POST /api/sub-admins
========================================================= */

router.post("/", protect, requireMainAdmin, createSubAdmin);

/* =========================================================
   GET ALL SUB ADMINS

   GET /api/sub-admins
========================================================= */

router.get("/", protect, requireMainAdmin, getSubAdmins);

/* =========================================================
   GET SINGLE SUB ADMIN

   GET /api/sub-admins/:id
========================================================= */

router.get("/:id", protect, requireMainAdmin, getSubAdmin);

/* =========================================================
   UPDATE SUB ADMIN

   PUT /api/sub-admins/:id
========================================================= */

router.put("/:id", protect, requireMainAdmin, updateSubAdmin);

/* =========================================================
   UPDATE SUB ADMIN PERMISSIONS

   PUT /api/sub-admins/:id/permissions
========================================================= */

router.put("/:id/permissions", protect, requireMainAdmin, updateSubAdminPermissions);

/* =========================================================
   RESET SUB ADMIN PASSWORD

   PATCH /api/sub-admins/:id/reset-password

   Admin directly sets a new password.
   No OTP required.
   No email required.
========================================================= */

router.patch("/:id/reset-password", protect, requireMainAdmin, resetSubAdminPassword);

/* =========================================================
   ACTIVATE / DEACTIVATE SUB ADMIN

   PATCH /api/sub-admins/:id/status
========================================================= */

router.patch("/:id/status", protect, requireMainAdmin, toggleSubAdminStatus);

/* =========================================================
   DELETE SUB ADMIN

   DELETE /api/sub-admins/:id
========================================================= */

router.delete("/:id", protect, requireMainAdmin, deleteSubAdmin);

export default router;
