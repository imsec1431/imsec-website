import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

import {
  saveMessage,
  getMessages,
  getMessage,
  markAsRead,
  deleteMessage,
} from "../controllers/contactController.js";

const router = express.Router();

// Public
router.post("/", saveMessage);

// Admin
router.get("/", protect, requireGlobalPermission("website-content", "contact-us"), getMessages);
router.get("/:id", protect, requireGlobalPermission("website-content", "contact-us"), getMessage);
router.put("/:id/read", protect, requireGlobalPermission("website-content", "contact-us"), markAsRead);
router.delete("/:id", protect, requireGlobalPermission("website-content", "contact-us"), deleteMessage);

export default router;
