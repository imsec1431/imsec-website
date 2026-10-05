import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import {
  getSports,
  getSportsAdmin,
  updateSports,
  deleteSportsImage,
  updateSportsImage,
  replaceSportsImage,
  resetSports,
} from "../controllers/SportsController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

router.get("/", getSports);

/* =========================================================
   ADMIN - GET
========================================================= */

router.get("/admin", protect,
  requireGlobalPermission("student-welfare", "sports"), getSportsAdmin);

/* =========================================================
   ADMIN - UPDATE COMPLETE SPORTS PAGE
========================================================= */

router.put(
  "/admin",
  protect,
  requireGlobalPermission("student-welfare", "sports"),
  upload.fields([
    {
      name: "galleryImages",
      maxCount: 20,
    },
  ]),
  validateUploadedFiles,
  updateSports,
);

/* =========================================================
   ADMIN - DELETE IMAGE
========================================================= */

router.delete("/admin/images/:imageId", protect,
  requireGlobalPermission("student-welfare", "sports"), deleteSportsImage);

/* =========================================================
   ADMIN - UPDATE IMAGE DETAILS
========================================================= */

router.put("/admin/images/:imageId", protect,
  requireGlobalPermission("student-welfare", "sports"), updateSportsImage);

/* =========================================================
   ADMIN - REPLACE IMAGE
========================================================= */

router.put(
  "/admin/images/:imageId/replace",
  protect,
  requireGlobalPermission("student-welfare", "sports"),
  upload.single("image"),
  validateUploadedFiles,
  replaceSportsImage,
);

/* =========================================================
   ADMIN - RESET DEFAULTS
========================================================= */

router.post("/admin/reset-defaults", protect,
  requireGlobalPermission("student-welfare", "sports"), resetSports);

export default router;
