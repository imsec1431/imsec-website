import express from "express";

import { protect } from "../middleware/authMiddleware.js";


import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import {
  getLibraryTiming,
  saveLibraryTiming,
} from "../controllers/libraryTimingController.js";

const router = express.Router();

// Get Timing
router.get("/", getLibraryTiming);

// Save / Update Timing
router.post(
  "/",
  protect,
  requireGlobalPermission("library", "timings"), saveLibraryTiming);

export default router;
