import express from "express";

import {
  getIMSSociety,
  getIMSSocietyAdmin,
  createIMSSociety,
  updateIMSSociety,
  deleteIMSSociety,
} from "../controllers/imsSocietyController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| Public website can view IMS Society information.
|--------------------------------------------------------------------------
*/

router.get("/", getIMSSociety);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Get IMS Society content for administration.
|
| Required permission:
| about-imsec → ims-society
|--------------------------------------------------------------------------
*/

router.get(
  "/admin",
  protect,
  requireGlobalPermission("about-imsec", "ims-society"),
  getIMSSocietyAdmin,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Create IMS Society content.
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  protect,
  requireGlobalPermission("about-imsec", "ims-society"),
  createIMSSociety,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Update IMS Society content.
|--------------------------------------------------------------------------
*/

router.put(
  "/",
  protect,
  requireGlobalPermission("about-imsec", "ims-society"),
  updateIMSSociety,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Delete IMS Society content.
|--------------------------------------------------------------------------
*/

router.delete(
  "/",
  protect,
  requireGlobalPermission("about-imsec", "ims-society"),
  deleteIMSSociety,
);

export default router;
