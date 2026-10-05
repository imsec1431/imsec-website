import express from "express";

import {
  getIQAC,
  getIQACAdmin,
  updateIQAC,
  resetIQAC,
} from "../controllers/IQACController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

router.get("/", getIQAC);

/* =========================================================
   ADMIN
========================================================= */

router.get(
  "/admin",
  protect,
  requireGlobalPermission("iqac", "iqac"),
  getIQACAdmin,
);

router.put(
  "/admin",
  protect,
  requireGlobalPermission("iqac", "iqac"),
  updateIQAC,
);

router.post(
  "/admin/reset-defaults",
  protect,
  requireGlobalPermission("iqac", "iqac"),
  resetIQAC,
);

export default router;
