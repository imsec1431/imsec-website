import express from "express";

import {
  getPublicApprovals,
  getAdminApprovals,
  createApproval,
  updateApproval,
  publishApproval,
  unpublishApproval,
  deleteApproval,
} from "../controllers/approvalController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| Display published Approval information on the public website.
|
| This route intentionally remains public.
|--------------------------------------------------------------------------
*/

router.get("/", getPublicApprovals);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Get Approval records for administration.
|
| Required permission:
| Homepage → Approval
|--------------------------------------------------------------------------
*/

router.get(
  "/admin",
  protect,
  requireGlobalPermission("homepage", "approval"),
  getAdminApprovals,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Create Approval.
|--------------------------------------------------------------------------
*/

router.post(
  "/admin",
  protect,
  requireGlobalPermission("homepage", "approval"),
  createApproval,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Update Approval.
|--------------------------------------------------------------------------
*/

router.put(
  "/admin/:id",
  protect,
  requireGlobalPermission("homepage", "approval"),
  updateApproval,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Publish Approval.
|--------------------------------------------------------------------------
*/

router.patch(
  "/admin/:id/publish",
  protect,
  requireGlobalPermission("homepage", "approval"),
  publishApproval,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Unpublish Approval.
|--------------------------------------------------------------------------
*/

router.patch(
  "/admin/:id/unpublish",
  protect,
  requireGlobalPermission("homepage", "approval"),
  unpublishApproval,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Delete Approval.
|--------------------------------------------------------------------------
*/

router.delete(
  "/admin/:id",
  protect,
  requireGlobalPermission("homepage", "approval"),
  deleteApproval,
);

export default router;
