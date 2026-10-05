import Achievement from "../models/Achievement.js";
import cloudinary4 from "../config/cloudinaryConfig4.js";

// Create Achievement
export const createAchievement = async (req, res) => {
  try {
    const { title, order, isActive } = req.body;

    const result = await cloudinary4.uploader.upload(req.file.path, {
      folder: "achievements",
    });

    const achievement = await Achievement.create({
      title,
      image: result.secure_url,
      publicId: result.public_id,
      order,
      isActive,
    });

    res.status(201).json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Achievements
export const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: achievements.length,
      data: achievements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Achievement By ID
export const getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }

    res.status(200).json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Achievement
export const updateAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }

    let image = achievement.image;
    let publicId = achievement.publicId;

    if (req.file) {
      await cloudinary4.uploader.destroy(achievement.publicId);

      const result = await cloudinary4.uploader.upload(req.file.path, {
        folder: "achievements",
      });

      image = result.secure_url;
      publicId = result.public_id;
    }

    achievement.title = req.body.title;
    achievement.order = req.body.order;
    achievement.isActive = req.body.isActive;
    achievement.image = image;
    achievement.publicId = publicId;

    await achievement.save();

    res.status(200).json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Achievement
export const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }

    await cloudinary4.uploader.destroy(achievement.publicId);

    await achievement.deleteOne();

    res.status(200).json({
      success: true,
      message: "Achievement deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
