import express from "express";

import { protect } from "../middleware/authMiddleware.js";


import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import {
  getResearchPartners,
  getResearchPartner,
  createResearchPartner,
  updateResearchPartner,
  deleteResearchPartner,
} from "../controllers/researchPartnerController.js";

const router = express.Router();

router.get("/", getResearchPartners);

router.get("/:id", getResearchPartner);

router.post(
  "/",
  protect,
  requireGlobalPermission("research", "overview"), createResearchPartner);

router.put(
  "/:id",
  protect,
  requireGlobalPermission("research", "overview"), updateResearchPartner);

router.delete(
  "/:id",
  protect,
  requireGlobalPermission("research", "overview"), deleteResearchPartner);

export default router;
