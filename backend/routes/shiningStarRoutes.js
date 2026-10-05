import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import {
  getPublishedShiningStars,
  getAllShiningStars,
  getShiningStarById,
  createShiningStar,
  updateShiningStar,
  deleteShiningStar,
  toggleShiningStarStatus,
} from "../controllers/shiningStarController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

router.get("/", getPublishedShiningStars);

/* =========================================================
   ADMIN
========================================================= */

router.get("/admin", protect,
  requireGlobalPermission("placements", "shining-stars"), getAllShiningStars);

router.get("/:id", protect,
  requireGlobalPermission("placements", "shining-stars"), getShiningStarById);

router.post("/", protect,
  requireGlobalPermission("placements", "shining-stars"), upload.single("image"),
  validateUploadedFiles, createShiningStar);

router.put("/:id", protect,
  requireGlobalPermission("placements", "shining-stars"), upload.single("image"),
  validateUploadedFiles, updateShiningStar);

router.delete("/:id", protect,
  requireGlobalPermission("placements", "shining-stars"), deleteShiningStar);

router.patch("/:id/status", protect,
  requireGlobalPermission("placements", "shining-stars"), toggleShiningStarStatus);

export default router;
