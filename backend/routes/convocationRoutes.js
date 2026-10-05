import express from "express";

import {
  getPublicConvocations,
  getAdminConvocations,
  createConvocation,
  updateConvocation,
  publishConvocation,
  unpublishConvocation,
  deleteConvocation,
} from "../controllers/convocationController.js";

import { protect } from "../middleware/authMiddleware.js";

import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
   ========================================================= */

/*
 * Get published convocations
 *
 * GET /api/convocation
 *
 * Public website.
 */
router.get("/", getPublicConvocations);

/* =========================================================
   ADMIN
   =========================================================
   
   Permission:
   Academics → Convocation
   
   Key:
   academics → convocation
   ========================================================= */

/*
 * Get all convocations
 *
 * GET /api/convocation/admin
 */
router.get(
  "/admin",
  protect,
  requireGlobalPermission("academics", "convocation"),
  getAdminConvocations,
);

/*
 * Create convocation
 *
 * POST /api/convocation/admin
 */
router.post(
  "/admin",
  protect,
  requireGlobalPermission("academics", "convocation"),
  createConvocation,
);

/*
 * Update convocation
 *
 * PUT /api/convocation/admin/:id
 */
router.put(
  "/admin/:id",
  protect,
  requireGlobalPermission("academics", "convocation"),
  updateConvocation,
);

/*
 * Publish convocation
 *
 * PATCH /api/convocation/admin/:id/publish
 */
router.patch(
  "/admin/:id/publish",
  protect,
  requireGlobalPermission("academics", "convocation"),
  publishConvocation,
);

/*
 * Unpublish convocation
 *
 * PATCH /api/convocation/admin/:id/unpublish
 */
router.patch(
  "/admin/:id/unpublish",
  protect,
  requireGlobalPermission("academics", "convocation"),
  unpublishConvocation,
);

/*
 * Delete convocation
 *
 * DELETE /api/convocation/admin/:id
 */
router.delete(
  "/admin/:id",
  protect,
  requireGlobalPermission("academics", "convocation"),
  deleteConvocation,
);

export default router;
