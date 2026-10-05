import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import {
  getGym,
  getGymAdmin,
  updateGym,
  resetGym,
} from "../controllers/GymController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
   ========================================================= */

router.get("/", getGym);

/* =========================================================
   ADMIN
   ========================================================= */

router.get("/admin", protect,
  requireGlobalPermission("student-welfare", "gym"), getGymAdmin);

router.put(
  "/admin",
  protect,
  requireGlobalPermission("student-welfare", "gym"),
  upload.fields([
    { name: "photo1", maxCount: 1 },
    { name: "photo2", maxCount: 1 },
  ]),
  validateUploadedFiles,
  updateGym,
);

router.post("/admin/reset-defaults", protect,
  requireGlobalPermission("student-welfare", "gym"), resetGym);

export default router;
