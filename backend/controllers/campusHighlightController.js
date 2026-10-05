import CampusHighlight from "../models/CampusHighlight.js";
import cloudinary4 from "../config/cloudinaryConfig4.js";

// =============================
// Create Campus Highlight
// =============================
export const createCampusHighlight = async (req, res) => {
  try {
    const {
      eventType,
      title,
      date,
      description,
      facebook,
      instagram,
      linkedin,
      readMore,
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
      folder: "campus-highlights",
    });

    const highlight = await CampusHighlight.create({
      eventType,
      title,
      date,
      description,
      image: result.secure_url,
      publicId: result.public_id,
      facebook,
      instagram,
      linkedin,
      readMore,
      order,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Campus Highlight created successfully",
      data: highlight,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get All Campus Highlights
// =============================
export const getCampusHighlights = async (req, res) => {
  try {
    const highlights = await CampusHighlight.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: highlights.length,
      data: highlights,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get Single Campus Highlight
// =============================
export const getCampusHighlight = async (req, res) => {
  try {
    const highlight = await CampusHighlight.findById(req.params.id);

    if (!highlight) {
      return res.status(404).json({
        success: false,
        message: "Campus Highlight not found",
      });
    }

    res.status(200).json({
      success: true,
      data: highlight,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Update Campus Highlight
// =============================
export const updateCampusHighlight = async (req, res) => {
  try {
    const highlight = await CampusHighlight.findById(req.params.id);

    if (!highlight) {
      return res.status(404).json({
        success: false,
        message: "Campus Highlight not found",
      });
    }

    let image = highlight.image;
    let publicId = highlight.publicId;

    if (req.file) {
      await cloudinary4.uploader.destroy(highlight.publicId);

      const result = await cloudinary4.uploader.upload(req.file.path, {
        folder: "campus-highlights",
      });

      image = result.secure_url;
      publicId = result.public_id;
    }

    const updated = await CampusHighlight.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image,
        publicId,
      },
      {
        new: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Campus Highlight updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Delete Campus Highlight
// =============================
export const deleteCampusHighlight = async (req, res) => {
  try {
    const highlight = await CampusHighlight.findById(req.params.id);

    if (!highlight) {
      return res.status(404).json({
        success: false,
        message: "Campus Highlight not found",
      });
    }

    await cloudinary4.uploader.destroy(highlight.publicId);

    await highlight.deleteOne();

    res.status(200).json({
      success: true,
      message: "Campus Highlight deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
