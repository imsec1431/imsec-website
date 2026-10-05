import express from "express";

import { protect } from "../middleware/authMiddleware.js";


import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import {
  getResearchAbout,
  createResearchAbout,
  updateResearchAbout,
  deleteResearchAbout,
} from "../controllers/researchAboutController.js";

const router = express.Router();

router.get("/", getResearchAbout);

router.post(
  "/",
  protect,
  requireGlobalPermission("research", "about"), createResearchAbout);

router.put(
  "/:id",
  protect,
  requireGlobalPermission("research", "about"), updateResearchAbout);

router.delete(
  "/:id",
  protect,
  requireGlobalPermission("research", "about"), deleteResearchAbout);

export default router;
