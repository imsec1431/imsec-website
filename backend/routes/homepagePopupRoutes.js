import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import {
  getAllHomepagePopups,
  getActiveHomepagePopups,
  getHomepagePopupById,
  createHomepagePopup,
  updateHomepagePopup,
  deleteHomepagePopup,
  updateHomepagePopupSettings,
  resetHomepagePopupSettings,
} from "../controllers/homepagePopupController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

/*
 * GET
 * /api/homepage-popup/public
 *
 * Public website needs the active popup.
 */
router.get("/public", getActiveHomepagePopups);

/* =========================================================
   ADMIN - GET ALL
========================================================= */

/*
 * GET
 * /api/homepage-popup
 *
 * Permission:
 * Website Content → Homepage Popup
 */
router.get(
  "/",
  protect,
  requireGlobalPermission("website-content", "homepage-popup"),
  getAllHomepagePopups,
);

/* =========================================================
   ADMIN SETTINGS
========================================================= */

/*
 * SAVE SETTINGS
 *
 * PUT
 * /api/homepage-popup/admin/settings
 *
 * Permission:
 * Website Content → Homepage Popup
 */
router.put(
  "/admin/settings",
  protect,
  requireGlobalPermission("website-content", "homepage-popup"),
  updateHomepagePopupSettings,
);

/*
 * RESET SETTINGS
 *
 * POST
 * /api/homepage-popup/admin/settings/reset
 *
 * Permission:
 * Website Content → Homepage Popup
 */
router.post(
  "/admin/settings/reset",
  protect,
  requireGlobalPermission("website-content", "homepage-popup"),
  resetHomepagePopupSettings,
);

/* =========================================================
   ADMIN - SINGLE POPUP
========================================================= */

/*
 * GET SINGLE POPUP
 *
 * GET
 * /api/homepage-popup/admin/:id
 *
 * Permission:
 * Website Content → Homepage Popup
 */
router.get(
  "/admin/:id",
  protect,
  requireGlobalPermission("website-content", "homepage-popup"),
  getHomepagePopupById,
);

/* =========================================================
   ADMIN - CREATE POPUP
========================================================= */

/*
 * POST
 * /api/homepage-popup/admin
 *
 * multipart/form-data
 *
 * file field:
 * "file"
 *
 * Permission:
 * Website Content → Homepage Popup
 */
router.post(
  "/admin",
  protect,
  requireGlobalPermission("website-content", "homepage-popup"),
  upload.single("file"),
  validateUploadedFiles,
  createHomepagePopup,
);

/* =========================================================
   ADMIN - UPDATE POPUP
========================================================= */

/*
 * PUT
 * /api/homepage-popup/admin/:id
 *
 * File is optional during update.
 *
 * Permission:
 * Website Content → Homepage Popup
 */
router.put(
  "/admin/:id",
  protect,
  requireGlobalPermission("website-content", "homepage-popup"),
  upload.single("file"),
  validateUploadedFiles,
  updateHomepagePopup,
);

/* =========================================================
   ADMIN - DELETE POPUP
========================================================= */

/*
 * DELETE
 * /api/homepage-popup/admin/:id
 *
 * Permission:
 * Website Content → Homepage Popup
 */
router.delete(
  "/admin/:id",
  protect,
  requireGlobalPermission("website-content", "homepage-popup"),
  deleteHomepagePopup,
);

/* =========================================================
   EXPORT
========================================================= */

export default router;
