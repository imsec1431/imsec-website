import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import upload from "../middleware/multerMiddleware.js";

import {
  getIMSGroupImage,
  getIMSGroupImageAdmin,
  createIMSGroupImage,
  updateIMSGroupImage,
  deleteIMSGroupImage,
} from "../controllers/imsGroupImageController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/*=========================================
PUBLIC
=========================================*/

router.get("/", getIMSGroupImage);

/*=========================================
ADMIN GET
=========================================*/

router.get("/admin", protect,
  requireGlobalPermission("about-imsec", "ims-group"), getIMSGroupImageAdmin);

/*=========================================
ADMIN CREATE
=========================================*/

router.post("/", protect,
  requireGlobalPermission("about-imsec", "ims-group"), upload.single("image"),
  validateUploadedFiles, createIMSGroupImage);

/*=========================================
ADMIN UPDATE
=========================================*/

router.put("/", protect,
  requireGlobalPermission("about-imsec", "ims-group"), upload.single("image"),
  validateUploadedFiles, updateIMSGroupImage);

/*=========================================
ADMIN DELETE
=========================================*/

router.delete("/", protect,
  requireGlobalPermission("about-imsec", "ims-group"), deleteIMSGroupImage);

export default router;
