import express from "express";

import { protect } from "../middleware/authMiddleware.js";


import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import {
  addGuideline,
  getGuidelines,
  getGuideline,
  updateGuideline,
  deleteGuideline,
} from "../controllers/libraryGuidelineController.js";

const router = express.Router();

router.get("/", getGuidelines);

router.get("/:id", getGuideline);

router.post(
  "/",
  protect,
  requireGlobalPermission("library", "guidelines"), addGuideline);

router.put(
  "/:id",
  protect,
  requireGlobalPermission("library", "guidelines"), updateGuideline);

router.delete(
  "/:id",
  protect,
  requireGlobalPermission("library", "guidelines"), deleteGuideline);

export default router;
