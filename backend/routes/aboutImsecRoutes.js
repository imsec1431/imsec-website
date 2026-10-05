import express from "express";

import {
  getPublicAboutImsec,
  getAdminAboutImsec,
  createAboutImsec,
  updateAboutImsec,
  publishAboutImsec,
  unpublishAboutImsec,
  deleteAboutImsec,
} from "../controllers/aboutImsecController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| Public About IMSEC page.
|
| This route intentionally remains public because visitors need to
| view About IMSEC information.
|--------------------------------------------------------------------------
*/

router.get("/", getPublicAboutImsec);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Get About IMSEC data for management.
|
| Required permission:
| about-imsec
| about-imsec-page
|--------------------------------------------------------------------------
*/

router.get(
  "/admin",
  protect,
  requireGlobalPermission("about-imsec", "about-imsec-page"),
  getAdminAboutImsec,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Create About IMSEC content.
|--------------------------------------------------------------------------
*/

router.post(
  "/admin",
  protect,
  requireGlobalPermission("about-imsec", "about-imsec-page"),
  createAboutImsec,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Update About IMSEC content.
|--------------------------------------------------------------------------
*/

router.put(
  "/admin/:id",
  protect,
  requireGlobalPermission("about-imsec", "about-imsec-page"),
  updateAboutImsec,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Publish About IMSEC content.
|--------------------------------------------------------------------------
*/

router.patch(
  "/admin/:id/publish",
  protect,
  requireGlobalPermission("about-imsec", "about-imsec-page"),
  publishAboutImsec,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Unpublish About IMSEC content.
|--------------------------------------------------------------------------
*/

router.patch(
  "/admin/:id/unpublish",
  protect,
  requireGlobalPermission("about-imsec", "about-imsec-page"),
  unpublishAboutImsec,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Delete About IMSEC content.
|--------------------------------------------------------------------------
*/

router.delete(
  "/admin/:id",
  protect,
  requireGlobalPermission("about-imsec", "about-imsec-page"),
  deleteAboutImsec,
);

export default router;
