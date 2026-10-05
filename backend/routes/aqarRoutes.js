import express from "express";

import {
  getAQAR,
  getAQARAdmin,
  updateAQAR,
  resetAQAR,
} from "../controllers/AQARController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* PUBLIC */

router.get("/", getAQAR);

/* ADMIN */

router.get(
  "/admin",
  protect,
  requireGlobalPermission("iqac", "aqar"),
  getAQARAdmin,
);

router.put(
  "/admin",
  protect,
  requireGlobalPermission("iqac", "aqar"),
  updateAQAR,
);

router.post(
  "/admin/reset-defaults",
  protect,
  requireGlobalPermission("iqac", "aqar"),
  resetAQAR,
);

export default router;
