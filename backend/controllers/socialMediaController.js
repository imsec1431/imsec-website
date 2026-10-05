import SocialMedia from "../models/SocialMedia.js";

// =========================================================
// PUBLIC
// Get active social media links
// GET /api/social-media
// =========================================================

export const getPublicSocialMedia = async (req, res) => {
  try {
    const socialMedia = await SocialMedia.find({
      isActive: true,
    }).sort({
      displayOrder: 1,
    });

    res.status(200).json({
      success: true,
      data: socialMedia,
    });
  } catch (error) {
    console.error("Get public social media error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load social media links.",
    });
  }
};

// =========================================================
// ADMIN
// Get all social media links
// GET /api/social-media/admin
// =========================================================

export const getAdminSocialMedia = async (req, res) => {
  try {
    const socialMedia = await SocialMedia.find().sort({
      displayOrder: 1,
    });

    res.status(200).json({
      success: true,
      data: socialMedia,
    });
  } catch (error) {
    console.error("Get admin social media error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load social media links.",
    });
  }
};

// =========================================================
// ADMIN
// Create social media link
// POST /api/social-media/admin
// =========================================================

export const createSocialMedia = async (req, res) => {
  try {
    const { platform, url, isActive, displayOrder } = req.body;

    if (!platform) {
      return res.status(400).json({
        success: false,
        message: "Platform is required.",
      });
    }

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "Social media URL is required.",
      });
    }

    const existing = await SocialMedia.findOne({
      platform,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `${platform} already exists. Please edit the existing link.`,
      });
    }

    const socialMedia = await SocialMedia.create({
      platform,
      url,
      isActive:
        isActive === undefined
          ? true
          : isActive === true || isActive === "true",
      displayOrder: Number(displayOrder) || 0,
    });

    res.status(201).json({
      success: true,
      message: "Social media link added successfully.",
      data: socialMedia,
    });
  } catch (error) {
    console.error("Create social media error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to create social media link.",
    });
  }
};

// =========================================================
// ADMIN
// Update social media link
// PUT /api/social-media/admin/:id
// =========================================================

export const updateSocialMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const socialMedia = await SocialMedia.findById(id);

    if (!socialMedia) {
      return res.status(404).json({
        success: false,
        message: "Social media link not found.",
      });
    }

    const { platform, url, isActive, displayOrder } = req.body;

    if (platform) {
      const duplicate = await SocialMedia.findOne({
        platform,
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `${platform} already exists.`,
        });
      }

      socialMedia.platform = platform;
    }

    if (url !== undefined) {
      socialMedia.url = url;
    }

    if (isActive !== undefined) {
      socialMedia.isActive = isActive === true || isActive === "true";
    }

    if (displayOrder !== undefined) {
      socialMedia.displayOrder = Number(displayOrder) || 0;
    }

    const updatedSocialMedia = await socialMedia.save();

    res.status(200).json({
      success: true,
      message: "Social media link updated successfully.",
      data: updatedSocialMedia,
    });
  } catch (error) {
    console.error("Update social media error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to update social media link.",
    });
  }
};

// =========================================================
// ADMIN
// Activate social media
// PATCH /api/social-media/admin/:id/activate
// =========================================================

export const activateSocialMedia = async (req, res) => {
  try {
    const socialMedia = await SocialMedia.findById(req.params.id);

    if (!socialMedia) {
      return res.status(404).json({
        success: false,
        message: "Social media link not found.",
      });
    }

    socialMedia.isActive = true;

    await socialMedia.save();

    res.status(200).json({
      success: true,
      message: "Social media link activated successfully.",
      data: socialMedia,
    });
  } catch (error) {
    console.error("Activate social media error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to activate social media link.",
    });
  }
};

// =========================================================
// ADMIN
// Deactivate social media
// PATCH /api/social-media/admin/:id/deactivate
// =========================================================

export const deactivateSocialMedia = async (req, res) => {
  try {
    const socialMedia = await SocialMedia.findById(req.params.id);

    if (!socialMedia) {
      return res.status(404).json({
        success: false,
        message: "Social media link not found.",
      });
    }

    socialMedia.isActive = false;

    await socialMedia.save();

    res.status(200).json({
      success: true,
      message: "Social media link deactivated successfully.",
      data: socialMedia,
    });
  } catch (error) {
    console.error("Deactivate social media error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to deactivate social media link.",
    });
  }
};

// =========================================================
// ADMIN
// Delete social media link
// DELETE /api/social-media/admin/:id
// =========================================================

export const deleteSocialMedia = async (req, res) => {
  try {
    const socialMedia = await SocialMedia.findById(req.params.id);

    if (!socialMedia) {
      return res.status(404).json({
        success: false,
        message: "Social media link not found.",
      });
    }

    await socialMedia.deleteOne();

    res.status(200).json({
      success: true,
      message: "Social media link deleted successfully.",
    });
  } catch (error) {
    console.error("Delete social media error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete social media link.",
    });
  }
};
