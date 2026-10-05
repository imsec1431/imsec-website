import express from "express";

import {
  getNAAC,
  getNAACAdmin,
  updateNAAC,
  deleteNAACRecord,
  resetNAAC,
} from "../controllers/NAACController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* PUBLIC */

router.get("/", getNAAC);

/* ADMIN */

router.get(
  "/admin",
  protect,
  requireGlobalPermission("iqac", "naac"),
  getNAACAdmin,
);

router.put(
  "/admin",
  protect,
  requireGlobalPermission("iqac", "naac"),
  updateNAAC,
);

router.delete(
  "/admin/:id",
  protect,
  requireGlobalPermission("iqac", "naac"),
  deleteNAACRecord,
);

router.post(
  "/admin/reset-defaults",
  protect,
  requireGlobalPermission("iqac", "naac"),
  resetNAAC,
);

export default router;
