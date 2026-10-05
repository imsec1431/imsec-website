import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import upload from "../middleware/multerMiddleware.js";

import {
  addMOU,
  getMOUs,
  getMOU,
  updateMOU,
  deleteMOU,
} from "../controllers/mouController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

router.get("/", getMOUs);

router.get("/:id", getMOU);

/* =========================================================
   ADMIN — CREATE
========================================================= */

router.post(
  "/",
  protect,
  requireGlobalPermission("academics", "mou"),
  upload.single("image"),
  validateUploadedFiles,
  addMOU,
);

/* =========================================================
   ADMIN — UPDATE
========================================================= */

router.put(
  "/:id",
  protect,
  requireGlobalPermission("academics", "mou"),
  upload.single("image"),
  validateUploadedFiles,
  updateMOU,
);

/* =========================================================
   ADMIN — DELETE
========================================================= */

router.delete(
  "/:id",
  protect,
  requireGlobalPermission("academics", "mou"),
  deleteMOU,
);

export default router;
