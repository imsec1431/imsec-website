import express from "express";

import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import upload from "../middleware/multerMiddleware.js";

import {
  addMember,
  getMembers,
  updateMember,
  deleteMember,
} from "../controllers/executiveCouncilController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| Anyone can view Executive Council members on the public website.
*/

router.get("/", getMembers);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Add Executive Council Member
|
| Required:
| 1. Valid JWT
| 2. about-imsec module permission
| 3. executive-council sub-module permission
*/

router.post(
  "/",
  protect,
  requireGlobalPermission("about-imsec", "executive-council"),
  upload.single("photo"),
  validateUploadedFiles,
  addMember,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Update Executive Council Member
*/

router.put(
  "/:id",
  protect,
  requireGlobalPermission("about-imsec", "executive-council"),
  upload.single("photo"),
  validateUploadedFiles,
  updateMember,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Delete Executive Council Member
*/

router.delete(
  "/:id",
  protect,
  requireGlobalPermission("about-imsec", "executive-council"),
  deleteMember,
);

export default router;
