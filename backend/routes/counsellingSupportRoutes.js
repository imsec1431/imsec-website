import express from "express";

import {
  getCounsellingSupport,
  getCounsellingSupportAdmin,
  updateCounsellingSupport,
  resetCounsellingSupport,
} from "../controllers/CounsellingSupportController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

router.get("/", getCounsellingSupport);

/* =========================================================
   ADMIN
========================================================= */

router.get("/admin", protect,
  requireGlobalPermission("student-welfare", "counselling-support"), getCounsellingSupportAdmin);

router.put("/admin", protect,
  requireGlobalPermission("student-welfare", "counselling-support"), updateCounsellingSupport);

router.post("/admin/reset-defaults", protect,
  requireGlobalPermission("student-welfare", "counselling-support"), resetCounsellingSupport);

export default router;
