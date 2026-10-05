import express from "express";

import { protect } from "../middleware/authMiddleware.js";


import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import {
  getResearchPublicationContent,
  updateResearchPublicationContent,
} from "../controllers/researchPublicationContentController.js";

const router = express.Router();

/* Get public-page heading, statistics, timeline and databases */
router.get("/", getResearchPublicationContent);

/* Update public-page heading, statistics, timeline and databases */
router.put(
  "/",
  protect,
  requireGlobalPermission("research", "overview"), updateResearchPublicationContent);

export default router;
