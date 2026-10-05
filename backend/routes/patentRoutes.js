import express from "express";
import {
  getPatents,
  getPatentById,
  createPatent,
  updatePatent,
  deletePatent,
  getPatentContent,
  updatePatentContent,
} from "../controllers/patentController.js";

const router = express.Router();

// Content route (must be before /:id)
router.route("/content").get(getPatentContent).put(updatePatentContent);

// CRUD routes
router.route("/").get(getPatents).post(createPatent);
router.route("/:id").get(getPatentById).put(updatePatent).delete(deletePatent);

export default router;
