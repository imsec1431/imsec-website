import express from "express";
import {
  getBookContent,
  updateBookContent,
} from "../controllers/bookContentController.js";

const router = express.Router();

router.route("/").get(getBookContent).put(updateBookContent);

export default router;
