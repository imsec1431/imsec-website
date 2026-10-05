import express from "express";

import {
  getPublicVisionMission,
  getAdminVisionMission,
  createVisionMission,
  updateVisionMission,
  publishVisionMission,
  unpublishVisionMission,
  deleteVisionMission,
} from "../controllers/visionMissionController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| Public website can view Vision & Mission information.
|--------------------------------------------------------------------------
*/

router.get("/", getPublicVisionMission);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Get Vision & Mission content for management.
|
| Required permission:
| about-imsec → vision-mission
|--------------------------------------------------------------------------
*/

router.get(
  "/admin",
  protect,
  requireGlobalPermission("about-imsec", "vision-mission"),
  getAdminVisionMission,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Create Vision & Mission content.
|--------------------------------------------------------------------------
*/

router.post(
  "/admin",
  protect,
  requireGlobalPermission("about-imsec", "vision-mission"),
  createVisionMission,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Update Vision & Mission content.
|--------------------------------------------------------------------------
*/

router.put(
  "/admin/:id",
  protect,
  requireGlobalPermission("about-imsec", "vision-mission"),
  updateVisionMission,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Publish Vision & Mission content.
|--------------------------------------------------------------------------
*/

router.patch(
  "/admin/:id/publish",
  protect,
  requireGlobalPermission("about-imsec", "vision-mission"),
  publishVisionMission,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Unpublish Vision & Mission content.
|--------------------------------------------------------------------------
*/

router.patch(
  "/admin/:id/unpublish",
  protect,
  requireGlobalPermission("about-imsec", "vision-mission"),
  unpublishVisionMission,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Delete Vision & Mission content.
|--------------------------------------------------------------------------
*/

router.delete(
  "/admin/:id",
  protect,
  requireGlobalPermission("about-imsec", "vision-mission"),
  deleteVisionMission,
);

export default router;
