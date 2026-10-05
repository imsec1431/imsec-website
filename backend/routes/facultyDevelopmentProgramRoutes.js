import express from "express";
import {
  getFDPs,
  getFDPById,
  createFDP,
  updateFDP,
  deleteFDP,
  getFDPContent,
  updateFDPContent,
} from "../controllers/facultyDevelopmentProgramController.js";

const router = express.Router();

// Content routes
router.route("/content").get(getFDPContent).put(updateFDPContent);

// Item routes
router.route("/").get(getFDPs).post(createFDP);
router.route("/:id").get(getFDPById).put(updateFDP).delete(deleteFDP);

export default router;
