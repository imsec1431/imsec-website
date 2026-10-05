import express from "express";

import {
  addCircularNotice,
  getCircularNotices,
  getCircularNotice,
  updateCircularNotice,
  deleteCircularNotice,
} from "../controllers/circularNoticeController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

router.get("/", getCircularNotices);

router.get("/:id", getCircularNotice);

/* =========================================================
   ADMIN — CREATE
========================================================= */

router.post(
  "/",
  protect,
  requireGlobalPermission("academics", "circular-notice"),
  addCircularNotice,
);

/* =========================================================
   ADMIN — UPDATE
========================================================= */

router.put(
  "/:id",
  protect,
  requireGlobalPermission("academics", "circular-notice"),
  updateCircularNotice,
);

/* =========================================================
   ADMIN — DELETE
========================================================= */

router.delete(
  "/:id",
  protect,
  requireGlobalPermission("academics", "circular-notice"),
  deleteCircularNotice,
);

export default router;
