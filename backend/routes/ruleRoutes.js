import express from "express";

import {
  addRule,
  getRules,
  getRule,
  updateRule,
  deleteRule,
} from "../controllers/ruleController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

router.get("/", getRules);

router.get("/:id", getRule);

/* =========================================================
   ADMIN
========================================================= */

router.post(
  "/",
  protect,
  requireGlobalPermission("academics", "rules"),
  addRule,
);

router.put(
  "/:id",
  protect,
  requireGlobalPermission("academics", "rules"),
  updateRule,
);

router.delete(
  "/:id",
  protect,
  requireGlobalPermission("academics", "rules"),
  deleteRule,
);

export default router;
