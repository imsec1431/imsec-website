import TeachingLearningProcess from "../models/TeachingLearningProcess.js";
import cloudinary from "../config/cloudinaryConfig.js";

/* =========================================================
   ADMIN — GET ALL IMAGES
========================================================= */

export const getAllTeachingLearningProcesses = async (req, res) => {
  try {
    const items = await TeachingLearningProcess.find({}).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("Get all teaching learning process error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load teaching learning process images.",
      error: error.message,
    });
  }
};

/* =========================================================
   PUBLIC — GET PUBLISHED IMAGES
========================================================= */

export const getPublishedTeachingLearningProcesses = async (req, res) => {
  try {
    const items = await TeachingLearningProcess.find({
      isPublished: true,
    })
      .sort({
        displayOrder: 1,
        createdAt: -1,
      })
      .select("image isPublished displayOrder createdAt");

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("Get published teaching learning process error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load teaching learning process images.",
      error: error.message,
    });
  }
};

/* =========================================================
   ADMIN — GET SINGLE
========================================================= */

export const getTeachingLearningProcessById = async (req, res) => {
  try {
    const item = await TeachingLearningProcess.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Teaching learning process image not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Get teaching learning process image error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load teaching learning process image.",
      error: error.message,
    });
  }
};

/* =========================================================
   ADMIN — CREATE
========================================================= */

export const createTeachingLearningProcess = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Teaching learning process photo is required.",
      });
    }

    /* =====================================================
       CLOUDINARY UPLOAD
    ===================================================== */

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "imsec/teaching-learning-process",

      resource_type: "image",
    });

    /* =====================================================
       CREATE DATABASE RECORD
    ===================================================== */

    const item = await TeachingLearningProcess.create({
      image: uploadResult.secure_url,

      publicId: uploadResult.public_id,

      isPublished:
        req.body.isPublished === undefined
          ? true
          : req.body.isPublished === true || req.body.isPublished === "true",

      displayOrder: Number(req.body.displayOrder) || 0,
    });

    return res.status(201).json({
      success: true,

      message: "Teaching learning process image uploaded successfully.",

      data: item,
    });
  } catch (error) {
    console.error("Create teaching learning process error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to upload teaching learning process image.",
      error: error.message,
    });
  }
};

/* =========================================================
   ADMIN — UPDATE
========================================================= */

export const updateTeachingLearningProcess = async (req, res) => {
  try {
    const item = await TeachingLearningProcess.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Teaching learning process image not found.",
      });
    }

    /* =====================================================
       REPLACE IMAGE
    ===================================================== */

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "imsec/teaching-learning-process",

        resource_type: "image",
      });

      /* ================================================
         DELETE OLD IMAGE
      ================================================= */

      if (item.publicId) {
        try {
          await cloudinary.uploader.destroy(item.publicId);
        } catch (deleteError) {
          console.error("Old image deletion error:", deleteError);
        }
      }

      item.image = uploadResult.secure_url;

      item.publicId = uploadResult.public_id;
    }

    /* =====================================================
       DISPLAY ORDER
    ===================================================== */

    if (req.body.displayOrder !== undefined) {
      item.displayOrder = Number(req.body.displayOrder) || 0;
    }

    /* =====================================================
       PUBLISHED STATUS
    ===================================================== */

    if (req.body.isPublished !== undefined) {
      item.isPublished =
        req.body.isPublished === true || req.body.isPublished === "true";
    }

    await item.save();

    return res.status(200).json({
      success: true,

      message: "Teaching learning process image updated successfully.",

      data: item,
    });
  } catch (error) {
    console.error("Update teaching learning process error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update teaching learning process image.",
      error: error.message,
    });
  }
};

/* =========================================================
   ADMIN — DELETE
========================================================= */

export const deleteTeachingLearningProcess = async (req, res) => {
  try {
    const item = await TeachingLearningProcess.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Teaching learning process image not found.",
      });
    }

    /* =====================================================
       DELETE CLOUDINARY IMAGE
    ===================================================== */

    if (item.publicId) {
      try {
        await cloudinary.uploader.destroy(item.publicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion error:", cloudinaryError);
      }
    }

    /* =====================================================
       DELETE DATABASE RECORD
    ===================================================== */

    await TeachingLearningProcess.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,

      message: "Teaching learning process image deleted successfully.",
    });
  } catch (error) {
    console.error("Delete teaching learning process error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete teaching learning process image.",
      error: error.message,
    });
  }
};

/* =========================================================
   ADMIN — PUBLISH / DRAFT
========================================================= */

export const toggleTeachingLearningProcessStatus = async (req, res) => {
  try {
    const item = await TeachingLearningProcess.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Teaching learning process image not found.",
      });
    }

    item.isPublished = !item.isPublished;

    await item.save();

    return res.status(200).json({
      success: true,

      message: item.isPublished
        ? "Teaching learning process image published successfully."
        : "Teaching learning process image moved to draft.",

      data: item,
    });
  } catch (error) {
    console.error("Toggle teaching learning process status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update teaching learning process status.",
      error: error.message,
    });
  }
};
