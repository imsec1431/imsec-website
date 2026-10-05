import express from "express";

import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import upload from "../middleware/multerMiddleware.js";

import {
  addMember,
  getMembers,
  updateMember,
  deleteMember,
} from "../controllers/governingCouncilController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC — GET ALL GOVERNING COUNCIL MEMBERS

   GET /api/governing-council

   Public website needs to display governing council members.

   Therefore:
   - NO protect
   - NO permission middleware
========================================================= */

router.get("/", getMembers);

/* =========================================================
   ADMIN / SUB ADMIN — ADD MEMBER

   POST /api/governing-council

   Security:
   1. protect
   2. permission check
   3. image upload
   4. controller
========================================================= */

router.post(
  "/",
  protect,
  requireGlobalPermission("about-imsec", "governing-council"),
  upload.single("photo"),
  validateUploadedFiles,
  addMember,
);

/* =========================================================
   ADMIN / SUB ADMIN — UPDATE MEMBER

   PUT /api/governing-council/:id

   Security:
   1. protect
   2. permission check
   3. image upload
   4. controller
========================================================= */

router.put(
  "/:id",
  protect,
  requireGlobalPermission("about-imsec", "governing-council"),
  upload.single("photo"),
  validateUploadedFiles,
  updateMember,
);

/* =========================================================
   ADMIN / SUB ADMIN — DELETE MEMBER

   DELETE /api/governing-council/:id

   Security:
   1. protect
   2. permission check
   3. controller
========================================================= */

router.delete(
  "/:id",
  protect,
  requireGlobalPermission("about-imsec", "governing-council"),
  deleteMember,
);

export default router;
