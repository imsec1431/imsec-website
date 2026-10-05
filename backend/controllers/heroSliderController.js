import HeroSlider from "../models/HeroSlider.js";
import cloudinary4 from "../config/cloudinaryConfig4.js";

// ==========================
// CREATE HERO SLIDE
// ==========================

export const createHeroSlide = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      primaryButtonText,
      primaryButtonLink,
      secondaryButtonText,
      secondaryButtonLink,
      order,
      isActive,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const result = await cloudinary4.uploader.upload(req.file.path, {
      folder: "imsec/hero-slider",
    });

    const slide = await HeroSlider.create({
      title,
      subtitle,
      primaryButtonText,
      primaryButtonLink,
      secondaryButtonText,
      secondaryButtonLink,
      image: result.secure_url,
      publicId: result.public_id,
      order,
      isActive,
    });

    res.status(201).json({
      success: true,
      data: slide,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// GET ALL HERO SLIDES
// ==========================

export const getHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlider.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: slides.length,
      data: slides,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// GET SINGLE HERO SLIDE
// ==========================

export const getHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlider.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Slide not found",
      });
    }

    res.status(200).json({
      success: true,
      data: slide,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// UPDATE HERO SLIDE
// ==========================

export const updateHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlider.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Slide not found",
      });
    }

    let image = slide.image;
    let publicId = slide.publicId;

    if (req.file) {
      await cloudinary4.uploader.destroy(slide.publicId);

      const upload = await cloudinary4.uploader.upload(req.file.path, {
        folder: "imsec/hero-slider",
      });

      image = upload.secure_url;
      publicId = upload.public_id;
    }

    slide.title = req.body.title;
    slide.subtitle = req.body.subtitle;
    slide.primaryButtonText = req.body.primaryButtonText;
    slide.primaryButtonLink = req.body.primaryButtonLink;
    slide.secondaryButtonText = req.body.secondaryButtonText;
    slide.secondaryButtonLink = req.body.secondaryButtonLink;
    slide.order = req.body.order;
    slide.isActive = req.body.isActive;
    slide.image = image;
    slide.publicId = publicId;

    await slide.save();

    res.status(200).json({
      success: true,
      data: slide,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// DELETE HERO SLIDE
// ==========================

export const deleteHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlider.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Slide not found",
      });
    }

    await cloudinary4.uploader.destroy(slide.publicId);

    await slide.deleteOne();

    res.status(200).json({
      success: true,
      message: "Slide deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
