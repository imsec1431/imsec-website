import express from "express";

import { protect } from "../middleware/authMiddleware.js";


import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import {
  createCommitteeMember,
  getAllCommitteeMembers,
  getCommitteeMemberById,
  updateCommitteeMember,
  deleteCommitteeMember,
} from "../controllers/internalGrievanceCommitteeController.js";

const router = express.Router();

/* ==========================================
   Internal Grievance Committee Routes
========================================== */

// Add Committee Member
router.post(
  "/",
  protect,
  requireGlobalPermission("grievance", "internal-grievance-committee"), createCommitteeMember);

// Get All Committee Members - Priority Wise
router.get("/", getAllCommitteeMembers);

// Get Single Committee Member
router.get("/:id", getCommitteeMemberById);

// Update Committee Member
router.put(
  "/:id",
  protect,
  requireGlobalPermission("grievance", "internal-grievance-committee"), updateCommitteeMember);

// Delete Committee Member
router.delete(
  "/:id",
  protect,
  requireGlobalPermission("grievance", "internal-grievance-committee"), deleteCommitteeMember);

export default router;
