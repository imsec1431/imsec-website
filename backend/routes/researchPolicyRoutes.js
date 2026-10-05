import express from "express";

import { protect } from "../middleware/authMiddleware.js";


import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import {
  getResearchPolicies,
  getResearchPolicy,
  createResearchPolicy,
  updateResearchPolicy,
  deleteResearchPolicy,
} from "../controllers/researchPolicyController.js";

const router = express.Router();

router.get("/", getResearchPolicies);

router.get("/:id", getResearchPolicy);

router.post(
  "/",
  protect,
  requireGlobalPermission("research", "research-policy"), createResearchPolicy);

router.put(
  "/:id",
  protect,
  requireGlobalPermission("research", "research-policy"), updateResearchPolicy);

router.delete(
  "/:id",
  protect,
  requireGlobalPermission("research", "research-policy"), deleteResearchPolicy);

export default router;
