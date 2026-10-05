import express from "express";

import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import upload from "../middleware/multerMiddleware.js";

import {
  saveChairman,
  getChairman,
} from "../controllers/chairmanController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| The public website can display the Chairman information.
*/

router.get("/", getChairman);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Create / Update Chairman Message
|
| Required:
| 1. Valid JWT
| 2. about-imsec permission
| 3. chairman sub-module permission
*/

router.post(
  "/",
  protect,
  requireGlobalPermission("about-imsec", "chairman"),
  upload.single("photo"),
  validateUploadedFiles,
  saveChairman,
);

export default router;
