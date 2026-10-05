import express from "express";

import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import upload from "../middleware/multerMiddleware.js";

import {
  createCampusHighlight,
  getCampusHighlights,
  getCampusHighlight,
  updateCampusHighlight,
  deleteCampusHighlight,
} from "../controllers/campusHighlightController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| Get all Campus Highlights.
|
| This route remains public because the public website displays
| Campus Highlights.
|--------------------------------------------------------------------------
*/

router.get("/", getCampusHighlights);

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| Get a single Campus Highlight.
|--------------------------------------------------------------------------
*/

router.get("/:id", getCampusHighlight);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Create Campus Highlight.
|
| Permission:
| Homepage → Campus Highlights
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  protect,
  requireGlobalPermission("homepage", "campus-highlights"),
  upload.single("image"),
  validateUploadedFiles,
  createCampusHighlight,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Update Campus Highlight.
|
| Permission:
| Homepage → Campus Highlights
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  protect,
  requireGlobalPermission("homepage", "campus-highlights"),
  upload.single("image"),
  validateUploadedFiles,
  updateCampusHighlight,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Delete Campus Highlight.
|
| Permission:
| Homepage → Campus Highlights
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  protect,
  requireGlobalPermission("homepage", "campus-highlights"),
  deleteCampusHighlight,
);

export default router;
