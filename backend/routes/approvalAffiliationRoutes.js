import express from "express";

import {
  getPublicApprovalAffiliations,
  getAdminApprovalAffiliations,
  createApprovalAffiliation,
  updateApprovalAffiliation,
  publishApprovalAffiliation,
  unpublishApprovalAffiliation,
  deleteApprovalAffiliation,
} from "../controllers/approvalAffiliationController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| Get published Approval & Affiliation documents.
|
| This route remains public because the college website needs to display
| approval and affiliation information to visitors.
|--------------------------------------------------------------------------
*/

router.get("/", getPublicApprovalAffiliations);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Get all Approval & Affiliation documents.
|
| Required:
| 1. Valid authentication token
| 2. about-imsec module
| 3. approvals-affiliations sub-module
|--------------------------------------------------------------------------
*/

router.get(
  "/admin",
  protect,
  requireGlobalPermission("about-imsec", "approvals-affiliations"),
  getAdminApprovalAffiliations,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Create Approval & Affiliation document.
|--------------------------------------------------------------------------
*/

router.post(
  "/admin",
  protect,
  requireGlobalPermission("about-imsec", "approvals-affiliations"),
  createApprovalAffiliation,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Update Approval & Affiliation document.
|--------------------------------------------------------------------------
*/

router.put(
  "/admin/:id",
  protect,
  requireGlobalPermission("about-imsec", "approvals-affiliations"),
  updateApprovalAffiliation,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Publish Approval & Affiliation document.
|--------------------------------------------------------------------------
*/

router.patch(
  "/admin/:id/publish",
  protect,
  requireGlobalPermission("about-imsec", "approvals-affiliations"),
  publishApprovalAffiliation,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Unpublish Approval & Affiliation document.
|--------------------------------------------------------------------------
*/

router.patch(
  "/admin/:id/unpublish",
  protect,
  requireGlobalPermission("about-imsec", "approvals-affiliations"),
  unpublishApprovalAffiliation,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Delete Approval & Affiliation document.
|--------------------------------------------------------------------------
*/

router.delete(
  "/admin/:id",
  protect,
  requireGlobalPermission("about-imsec", "approvals-affiliations"),
  deleteApprovalAffiliation,
);

export default router;
