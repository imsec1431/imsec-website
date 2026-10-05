import express from "express";

import {
  getPublicWelcomeToIMSEC,
  getAdminWelcomeToIMSEC,
  createWelcomeToIMSEC,
  updateWelcomeToIMSEC,
  publishWelcomeToIMSEC,
  unpublishWelcomeToIMSEC,
  deleteWelcomeToIMSEC,
} from "../controllers/welcomeToIMSECController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| Display Welcome to IMSEC content on the public website.
|--------------------------------------------------------------------------
*/

router.get("/", getPublicWelcomeToIMSEC);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Get Welcome to IMSEC content for management.
|
| Required permission:
| Homepage → Welcome to IMSEC
|--------------------------------------------------------------------------
*/

router.get(
  "/admin",
  protect,
  requireGlobalPermission("homepage", "welcome-to-imsec"),
  getAdminWelcomeToIMSEC,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Create Welcome to IMSEC content.
|--------------------------------------------------------------------------
*/

router.post(
  "/admin",
  protect,
  requireGlobalPermission("homepage", "welcome-to-imsec"),
  createWelcomeToIMSEC,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Update Welcome to IMSEC content.
|--------------------------------------------------------------------------
*/

router.put(
  "/admin/:id",
  protect,
  requireGlobalPermission("homepage", "welcome-to-imsec"),
  updateWelcomeToIMSEC,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Publish Welcome to IMSEC content.
|--------------------------------------------------------------------------
*/

router.patch(
  "/admin/:id/publish",
  protect,
  requireGlobalPermission("homepage", "welcome-to-imsec"),
  publishWelcomeToIMSEC,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Unpublish Welcome to IMSEC content.
|--------------------------------------------------------------------------
*/

router.patch(
  "/admin/:id/unpublish",
  protect,
  requireGlobalPermission("homepage", "welcome-to-imsec"),
  unpublishWelcomeToIMSEC,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Delete Welcome to IMSEC content.
|--------------------------------------------------------------------------
*/

router.delete(
  "/admin/:id",
  protect,
  requireGlobalPermission("homepage", "welcome-to-imsec"),
  deleteWelcomeToIMSEC,
);

export default router;
