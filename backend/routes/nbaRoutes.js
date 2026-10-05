import express from "express";

import {
  getNBA,
  getNBAAdmin,
  updateNBA,
  deleteNBARecord,
  resetNBA,
} from "../controllers/NBAController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* PUBLIC */

router.get("/", getNBA);

/* ADMIN */

router.get(
  "/admin",
  protect,
  requireGlobalPermission("iqac", "nba"),
  getNBAAdmin,
);

router.put(
  "/admin",
  protect,
  requireGlobalPermission("iqac", "nba"),
  updateNBA,
);

router.delete(
  "/admin/:id",
  protect,
  requireGlobalPermission("iqac", "nba"),
  deleteNBARecord,
);

router.post(
  "/admin/reset-defaults",
  protect,
  requireGlobalPermission("iqac", "nba"),
  resetNBA,
);

export default router;
