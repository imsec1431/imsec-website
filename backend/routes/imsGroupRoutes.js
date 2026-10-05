import express from "express";

import {
  getIMSGroup,
  getIMSGroupAdmin,
  createIMSGroup,
  updateIMSGroup,
  deleteIMSGroup,
} from "../controllers/imsGroupController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| Public website can view IMS Group information.
|--------------------------------------------------------------------------
*/

router.get("/", getIMSGroup);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Get IMS Group information for management.
|
| Required permission:
| about-imsec → ims-group
|--------------------------------------------------------------------------
*/

router.get(
  "/admin",
  protect,
  requireGlobalPermission("about-imsec", "ims-group"),
  getIMSGroupAdmin,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Create IMS Group information.
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  protect,
  requireGlobalPermission("about-imsec", "ims-group"),
  createIMSGroup,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Update IMS Group information.
|--------------------------------------------------------------------------
*/

router.put(
  "/",
  protect,
  requireGlobalPermission("about-imsec", "ims-group"),
  updateIMSGroup,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Delete IMS Group information.
|--------------------------------------------------------------------------
*/

router.delete(
  "/",
  protect,
  requireGlobalPermission("about-imsec", "ims-group"),
  deleteIMSGroup,
);

export default router;
