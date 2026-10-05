import express from "express";


import { validateUploadedFiles } from "../middleware/validateUploadedFiles.js";
import upload from "../middleware/multerMiddleware.js";

import {
  createHeroSlide,
  getHeroSlides,
  getHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} from "../controllers/heroSliderController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGlobalPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| Get all Hero Slider slides.
|
| The public website needs this data to display the homepage slider.
|--------------------------------------------------------------------------
*/

router.get("/", getHeroSlides);

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| Get a single Hero Slider slide.
|
| This remains public because it is used by the website.
|--------------------------------------------------------------------------
*/

router.get("/:id", getHeroSlide);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Create Hero Slider slide.
|
| Required permission:
| Homepage → Hero Slider
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  protect,
  requireGlobalPermission("homepage", "hero-slider"),
  upload.single("image"),
  validateUploadedFiles,
  createHeroSlide,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Update Hero Slider slide.
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  protect,
  requireGlobalPermission("homepage", "hero-slider"),
  upload.single("image"),
  validateUploadedFiles,
  updateHeroSlide,
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUB ADMIN
|--------------------------------------------------------------------------
| Delete Hero Slider slide.
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  protect,
  requireGlobalPermission("homepage", "hero-slider"),
  deleteHeroSlide,
);

export default router;
