import cloudinary from "../config/cloudinaryConfig.js";
import LibraryGallery from "../models/LibraryGallery.js";

// ======================================
// Add Gallery Image
// ======================================

export const addGalleryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "library-gallery",
    });

    const gallery = await LibraryGallery.create({
      title: req.body.title,
      image: result.secure_url,
      publicId: result.public_id,
      displayOrder: req.body.displayOrder,
      active: req.body.active,
    });

    res.status(201).json({
      success: true,
      message: "Gallery Image Added Successfully",
      data: gallery,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get All Images
// ======================================

export const getGalleryImages = async (req, res) => {
  try {
    const gallery = await LibraryGallery.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: gallery.length,
      data: gallery,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Single Image
// ======================================

export const getGalleryImage = async (req, res) => {
  try {
    const gallery = await LibraryGallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery Image Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Gallery Image
// ======================================

export const updateGalleryImage = async (req, res) => {
  try {
    const gallery = await LibraryGallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery Image Not Found",
      });
    }

    gallery.title = req.body.title;
    gallery.displayOrder = req.body.displayOrder;
    gallery.active = req.body.active;

    if (req.file) {
      await cloudinary.uploader.destroy(gallery.publicId);

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "library-gallery",
      });

      gallery.image = result.secure_url;
      gallery.publicId = result.public_id;
    }

    await gallery.save();

    res.status(200).json({
      success: true,
      message: "Gallery Image Updated Successfully",
      data: gallery,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Gallery Image
// ======================================

export const deleteGalleryImage = async (req, res) => {
  try {
    const gallery = await LibraryGallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery Image Not Found",
      });
    }

    await cloudinary.uploader.destroy(gallery.publicId);

    await gallery.deleteOne();

    res.status(200).json({
      success: true,
      message: "Gallery Image Deleted Successfully",
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
