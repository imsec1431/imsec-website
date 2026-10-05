import IndustryAcademicsCollaboration, {
  getDefaultIndustryAcademicsCollaboration,
} from "../models/IndustryAcademicsCollaboration.js";

import cloudinary from "../config/cloudinaryConfig.js";
import fs from "fs";

// Get existing document or create default
const getOrCreateIndustryAcademicsCollaboration = async () => {
  let data = await IndustryAcademicsCollaboration.findOne({
    singletonKey: "industry-academics-collaboration",
  });

  if (!data) {
    data = await IndustryAcademicsCollaboration.create(
      getDefaultIndustryAcademicsCollaboration(),
    );
  }

  return data;
};

// Public
export const getIndustryAcademicsCollaboration = async (req, res) => {
  try {
    const data = await getOrCreateIndustryAcademicsCollaboration();

    return res.status(200).json({
      success: true,
      data: data.published
        ? data
        : {
            title: data.title,
            description: data.description,
            items: [],
            published: false,
          },
    });
  } catch (error) {
    console.error("Get Industry Academics Collaboration Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load Industry Academics Collaboration.",
    });
  }
};

// Admin
export const getIndustryAcademicsCollaborationAdmin = async (req, res) => {
  try {
    const data = await getOrCreateIndustryAcademicsCollaboration();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Industry Academics Collaboration Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load Industry Academics Collaboration.",
    });
  }
};

// Update complete data
export const updateIndustryAcademicsCollaboration = async (req, res) => {
  try {
    let data = req.body;

    if (req.body?.data && typeof req.body.data === "object") {
      data = req.body.data;
    }

    const page = await getOrCreateIndustryAcademicsCollaboration();

    if (data.title !== undefined) {
      const title = String(data.title).trim();

      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required.",
        });
      }

      page.title = title;
    }

    if (data.description !== undefined) {
      page.description = String(data.description).trim();
    }

    if (data.published !== undefined) {
      page.published = data.published === true || data.published === "true";
    }

    if (Array.isArray(data.items)) {
      page.items = data.items.map((item, index) => ({
        _id: item._id || undefined,

        title: String(item.title || "").trim(),

        photoUrl: String(item.photoUrl || "").trim(),

        photoPublicId: String(item.photoPublicId || "").trim(),

        linkUrl: String(item.linkUrl || "").trim(),

        description: String(item.description || "").trim(),

        certificateUrl: String(item.certificateUrl || "").trim(),

        isActive:
          item.isActive !== undefined
            ? item.isActive === true || item.isActive === "true"
            : true,

        order: Number(item.order) || index + 1,
      }));
    }

    await page.save();

    return res.status(200).json({
      success: true,
      message: "Industry Academics Collaboration updated successfully.",
      data: page,
    });
  } catch (error) {
    console.error("Update Industry Academics Collaboration Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update Industry Academics Collaboration.",
    });
  }
};

// Upload one photo to Cloudinary
export const uploadIndustryAcademicsPhoto = async (req, res) => {
  let uploadedFile = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    uploadedFile = req.file.path;

    const result = await cloudinary.uploader.upload(uploadedFile, {
      folder: "imsec/industry-academics",
      resource_type: "image",
    });

    // Remove temporary local file
    if (fs.existsSync(uploadedFile)) {
      fs.unlinkSync(uploadedFile);
    }

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully.",
      data: {
        photoUrl: result.secure_url,
        photoPublicId: result.public_id,
      },
    });
  } catch (error) {
    console.error("Upload Industry Academics Photo Error:", error);

    if (uploadedFile && fs.existsSync(uploadedFile)) {
      fs.unlinkSync(uploadedFile);
    }

    return res.status(500).json({
      success: false,
      message: "Unable to upload image.",
    });
  }
};

// Delete Cloudinary photo
export const deleteIndustryAcademicsPhoto = async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Cloudinary public ID is required.",
      });
    }

    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Industry Academics Photo Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete image.",
    });
  }
};

// Reset defaults
export const resetIndustryAcademicsCollaboration = async (req, res) => {
  try {
    const defaults = getDefaultIndustryAcademicsCollaboration();

    let page = await IndustryAcademicsCollaboration.findOne({
      singletonKey: "industry-academics-collaboration",
    });

    if (!page) {
      page = await IndustryAcademicsCollaboration.create(defaults);
    } else {
      page.title = defaults.title;
      page.description = defaults.description;
      page.items = defaults.items;
      page.published = defaults.published;

      await page.save();
    }

    return res.status(200).json({
      success: true,
      message: "Industry Academics Collaboration reset successfully.",
      data: page,
    });
  } catch (error) {
    console.error("Reset Industry Academics Collaboration Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset Industry Academics Collaboration.",
    });
  }
};
