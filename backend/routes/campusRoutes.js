import express from "express";

import {
  getPublicCampus,
  getAdminCampus,
  createCampus,
  updateCampus,
  publishCampus,
  unpublishCampus,
  deleteCampus,
} from "../controllers/campusController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| Get published Campus information.
|
| This route remains public because the public college website
| needs to display Campus information.
|--------------------------------------------------------------------------
*/

router.get("/", getPublicCampus);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Get Campus content for administration.
|
| Required permission:
| Homepage → Campus
|--------------------------------------------------------------------------
*/

router.get(
  "/admin",
  protect,
  requireGlobalPermission("about-imsec", "campus"),
  getAdminCampus,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Create Campus content.
|
| Required permission:
| Homepage → Campus
|--------------------------------------------------------------------------
*/

router.post(
  "/admin",
  protect,
  requireGlobalPermission("about-imsec", "campus"),
  createCampus,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Update Campus content.
|
| Required permission:
| Homepage → Campus
|--------------------------------------------------------------------------
*/

router.put(
  "/admin/:id",
  protect,
  requireGlobalPermission("about-imsec", "campus"),
  updateCampus,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Publish Campus content.
|
| Required permission:
| Homepage → Campus
|--------------------------------------------------------------------------
*/

router.patch(
  "/admin/:id/publish",
  protect,
  requireGlobalPermission("about-imsec", "campus"),
  publishCampus,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Unpublish Campus content.
|
| Required permission:
| Homepage → Campus
|--------------------------------------------------------------------------
*/

router.patch(
  "/admin/:id/unpublish",
  protect,
  requireGlobalPermission("about-imsec", "campus"),
  unpublishCampus,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Delete Campus content.
|
| Required permission:
| Homepage → Campus
|--------------------------------------------------------------------------
*/

router.delete(
  "/admin/:id",
  protect,
  requireGlobalPermission("about-imsec", "campus"),
  deleteCampus,
);

export default router;
