import express from "express";

import {
  getNIRF,
  getNIRFAdmin,
  updateNIRF,
  deleteNIRFRecord,
  resetNIRF,
} from "../controllers/NIRFController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* PUBLIC */

router.get("/", getNIRF);

/* ADMIN */

router.get(
  "/admin",
  protect,
  requireGlobalPermission("iqac", "nirf"),
  getNIRFAdmin,
);

router.put(
  "/admin",
  protect,
  requireGlobalPermission("iqac", "nirf"),
  updateNIRF,
);

router.delete(
  "/admin/:id",
  protect,
  requireGlobalPermission("iqac", "nirf"),
  deleteNIRFRecord,
);

router.post(
  "/admin/reset-defaults",
  protect,
  requireGlobalPermission("iqac", "nirf"),
  resetNIRF,
);

export default router;
