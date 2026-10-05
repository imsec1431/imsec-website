import express from "express";

import {
  getMedicalSupport,
  getMedicalSupportAdmin,
  updateMedicalSupport,
  resetMedicalSupport,
} from "../controllers/MedicalSupportController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

router.get("/", getMedicalSupport);

/* =========================================================
   ADMIN
========================================================= */

router.get("/admin", protect,
  requireGlobalPermission("student-welfare", "medical-support"), getMedicalSupportAdmin);

router.put("/admin", protect,
  requireGlobalPermission("student-welfare", "medical-support"), updateMedicalSupport);

router.post("/admin/reset-defaults", protect,
  requireGlobalPermission("student-welfare", "medical-support"), resetMedicalSupport);

export default router;
