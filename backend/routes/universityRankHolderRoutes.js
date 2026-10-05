import express from "express";

import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import upload from "../middleware/multerMiddleware.js";

import {
  createUniversityRankHolder,
  getUniversityRankHolders,
  getUniversityRankHolder,
  updateUniversityRankHolder,
  deleteUniversityRankHolder,
} from "../controllers/universityRankHolderController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| Get all University Rank Holders.
|
| The public website displays rank-holder information,
| therefore this route remains public.
|--------------------------------------------------------------------------
*/

router.get("/", getUniversityRankHolders);

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| Get a single University Rank Holder.
|--------------------------------------------------------------------------
*/

router.get("/:id", getUniversityRankHolder);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Create University Rank Holder.
|
| Required permission:
| Homepage → University Rank Holder
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  protect,
  requireGlobalPermission("homepage", "university-rank-holder"),
  upload.single("image"),
  validateUploadedFiles,
  createUniversityRankHolder,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Update University Rank Holder.
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  protect,
  requireGlobalPermission("homepage", "university-rank-holder"),
  upload.single("image"),
  validateUploadedFiles,
  updateUniversityRankHolder,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Delete University Rank Holder.
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  protect,
  requireGlobalPermission("homepage", "university-rank-holder"),
  deleteUniversityRankHolder,
);

export default router;
