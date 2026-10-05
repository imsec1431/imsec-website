import express from "express";

import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import upload from "../middleware/multerMiddleware.js";

import {
  saveDirector,
  getDirector,
} from "../controllers/directorController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| Public website needs to display the Director information.
*/

router.get("/", getDirector);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Create / Update Director
|
| Required:
| 1. Valid JWT
| 2. about-imsec module permission
| 3. director sub-module permission
*/

router.post(
  "/",
  protect,
  requireGlobalPermission("about-imsec", "director"),
  upload.single("photo"),
  validateUploadedFiles,
  saveDirector,
);

export default router;
