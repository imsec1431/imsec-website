import Chairman from "../models/Chairman.js";
import cloudinary from "../config/cloudinaryConfig.js";

export const saveChairman = async (req, res) => {
  try {
    const { chairmanName, message } = req.body;

    // Check existing Chairman record
    let chairman = await Chairman.findOne();

    // =====================================================
    // UPDATE EXISTING CHAIRMAN
    // =====================================================
    if (chairman) {
      chairman.chairmanName = chairmanName;
      chairman.message = message;

      // Photo is optional during update
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "imsec/chairman",
        });

        // Delete old Cloudinary image
        if (chairman.publicId) {
          await cloudinary.uploader.destroy(chairman.publicId);
        }

        // Save new image details
        chairman.imageUrl = result.secure_url;
        chairman.publicId = result.public_id;
      }

      await chairman.save();

      return res.status(200).json({
        success: true,
        message: "Chairman message updated successfully.",
        data: chairman,
      });
    }

    // =====================================================
    // CREATE NEW CHAIRMAN
    // =====================================================

    // Photo is compulsory when creating first record
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Chairman photo is required.",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "imsec/chairman",
    });

    chairman = await Chairman.create({
      chairmanName,
      message,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });

    return res.status(200).json({
      success: true,
      message: "Chairman message saved successfully.",
      data: chairman,
    });
  } catch (error) {
    console.error("Chairman save error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET CHAIRMAN
// =====================================================

export const getChairman = async (req, res) => {
  try {
    const chairman = await Chairman.findOne();

    return res.status(200).json({
      success: true,
      data: chairman,
    });
  } catch (error) {
    console.error("Chairman get error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
