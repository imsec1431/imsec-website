import express from "express";

import { protect } from "../middleware/authMiddleware.js";


import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import {
  getJournals,
  getJournal,
  createJournal,
  updateJournal,
  deleteJournal,
} from "../controllers/journalController.js";

const router = express.Router();

/* Get all research publications */
router.get("/", getJournals);

/* Get one research publication */
router.get("/:id", getJournal);

/* Add research publication */
router.post(
  "/",
  protect,
  requireGlobalPermission("research", "journals"), createJournal);

/* Update research publication */
router.put(
  "/:id",
  protect,
  requireGlobalPermission("research", "journals"), updateJournal);

/* Delete research publication */
router.delete(
  "/:id",
  protect,
  requireGlobalPermission("research", "journals"), deleteJournal);

export default router;
