import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import {
  getConferencePapers,
  getConferencePaper,
  createConferencePaper,
  updateConferencePaper,
  deleteConferencePaper,
} from "../controllers/conferencePaperController.js";

const router = express.Router();

router.get("/", getConferencePapers);

router.get("/:id", getConferencePaper);

router.post("/", protect, requireGlobalPermission("research", "conference-papers"), createConferencePaper);

router.put("/:id", protect, requireGlobalPermission("research", "conference-papers"), updateConferencePaper);

router.delete("/:id", protect, requireGlobalPermission("research", "conference-papers"), deleteConferencePaper);

export default router;
