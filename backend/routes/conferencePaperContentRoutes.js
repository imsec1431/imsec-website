import express from "express";

import { protect } from "../middleware/authMiddleware.js";


import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import {
  getConferencePaperContent,
  updateConferencePaperContent,
} from "../controllers/conferencePaperContentController.js";

const router = express.Router();

router.get("/", getConferencePaperContent);

router.put(
  "/",
  protect,
  requireGlobalPermission("research", "conference-papers"), updateConferencePaperContent);

export default router;
