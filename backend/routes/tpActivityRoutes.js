import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import {
  getPublicTPActivities,
  getAdminTPActivities,
  createTPActivity,
  updateTPActivity,
  deleteTPActivity,
} from "../controllers/tpActivityController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

router.get("/", getPublicTPActivities);

/* =========================================================
   ADMIN - GET ALL
========================================================= */

router.get("/admin", protect,
  requireGlobalPermission("placements", "tp-activities"), getAdminTPActivities);

/* =========================================================
   ADMIN - CREATE
========================================================= */

router.post(
  "/",
  protect,
  requireGlobalPermission("placements", "tp-activities"),
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "gallery",
      maxCount: 10,
    },
  ]),
  validateUploadedFiles,
  createTPActivity,
);

/* =========================================================
   ADMIN - UPDATE
========================================================= */

router.put(
  "/:id",
  protect,
  requireGlobalPermission("placements", "tp-activities"),
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "gallery",
      maxCount: 10,
    },
  ]),
  validateUploadedFiles,
  updateTPActivity,
);

/* =========================================================
   ADMIN - DELETE
========================================================= */

router.delete("/:id", protect,
  requireGlobalPermission("placements", "tp-activities"), deleteTPActivity);

export default router;
