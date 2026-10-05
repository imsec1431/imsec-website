import ShiningStar from "../models/shiningStarModel.js";
import { uploadPlacementImage, deletePlacementImage } from "../config/placementCloudinary2.js";
import fs from "fs/promises";

/* =========================================================
   DELETE TEMPORARY FILE
========================================================= */

const removeTempFile = async (filePath) => {
  if (!filePath) return;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error("Temporary file deletion error:", error.message);
  }
};

/* =========================================================
   ADMIN - GET ALL
========================================================= */

export const getAllShiningStars = async (req, res) => {
  try {
    const stars = await ShiningStar.find({})
      .sort({
        order: 1,
        createdAt: -1,
      })
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    return res.status(200).json({
      success: true,
      count: stars.length,
      data: stars,
    });
  } catch (error) {
    console.error("Get all shining stars error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load shining stars.",
      error: error.message,
    });
  }
};

/* =========================================================
   PUBLIC - GET PUBLISHED
========================================================= */

export const getPublishedShiningStars = async (req, res) => {
  try {
    const stars = await ShiningStar.find({
      isPublished: true,
    })
      .sort({
        order: 1,
        createdAt: -1,
      })
      .select("image imageAlt batch order createdAt");

    return res.status(200).json({
      success: true,
      count: stars.length,
      data: stars,
    });
  } catch (error) {
    console.error("Get published shining stars error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load shining stars.",
      error: error.message,
    });
  }
};

/* =========================================================
   ADMIN - GET SINGLE
========================================================= */

export const getShiningStarById = async (req, res) => {
  try {
    const star = await ShiningStar.findById(req.params.id);

    if (!star) {
      return res.status(404).json({
        success: false,
        message: "Shining star not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: star,
    });
  } catch (error) {
    console.error("Get shining star error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load shining star.",
      error: error.message,
    });
  }
};

/* =========================================================
   ADMIN - CREATE
========================================================= */

export const createShiningStar = async (req, res) => {
  let tempFilePath = null;

  try {
    const { imageAlt, batch, order, isPublished } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Shining star photo is required.",
      });
    }

    tempFilePath = req.file.path;

    /* ================================================
         CLOUDINARY
      ================================================ */

    const uploadResult = await uploadPlacementImage(req.file.path, "imsec/placements/shining-stars");

    /* ================================================
         DATABASE
      ================================================ */

    const star = await ShiningStar.create({
      image: uploadResult.secure_url,

      imagePublicId: uploadResult.public_id,

      imageAlt: imageAlt?.trim() || "IMSEC Shining Star",

      batch: batch?.trim() || "",

      order: Number(order) || 0,

      isPublished:
        isPublished === undefined
          ? true
          : isPublished === true || isPublished === "true",

      createdBy: req.admin?._id || null,

      updatedBy: req.admin?._id || null,
    });

    await removeTempFile(tempFilePath);

    return res.status(201).json({
      success: true,
      message: "Shining star created successfully.",
      data: star,
    });
  } catch (error) {
    console.error("Create shining star error:", error);

    await removeTempFile(tempFilePath);

    return res.status(500).json({
      success: false,
      message: "Unable to create shining star.",
      error: error.message,
    });
  }
};

/* =========================================================
   ADMIN - UPDATE
========================================================= */

export const updateShiningStar = async (req, res) => {
  let tempFilePath = null;

  try {
    const star = await ShiningStar.findById(req.params.id);

    if (!star) {
      return res.status(404).json({
        success: false,
        message: "Shining star not found.",
      });
    }

    const { imageAlt, batch, order, isPublished } = req.body;

    /* ================================================
         NEW IMAGE
      ================================================ */

    if (req.file) {
      tempFilePath = req.file.path;

      const uploadResult = await uploadPlacementImage(req.file.path, "imsec/placements/shining-stars");

      /* ==============================================
           DELETE OLD IMAGE
        ============================================== */

      if (star.imagePublicId) {
        try {
          await deletePlacementImage(star.imagePublicId);
        } catch (deleteError) {
          console.error("Old Cloudinary image deletion error:", deleteError);
        }
      }

      star.image = uploadResult.secure_url;

      star.imagePublicId = uploadResult.public_id;

      await removeTempFile(tempFilePath);

      tempFilePath = null;
    }

    /* ================================================
         TEXT
      ================================================ */

    if (imageAlt !== undefined) {
      star.imageAlt = imageAlt.trim();
    }

    if (batch !== undefined) {
      star.batch = batch.trim();
    }

    /* ================================================
         ORDER
      ================================================ */

    if (order !== undefined) {
      star.order = Number(order) || 0;
    }

    /* ================================================
         PUBLISHED
      ================================================ */

    if (isPublished !== undefined) {
      star.isPublished = isPublished === true || isPublished === "true";
    }

    star.updatedBy = req.admin?._id || null;

    await star.save();

    return res.status(200).json({
      success: true,
      message: "Shining star updated successfully.",
      data: star,
    });
  } catch (error) {
    console.error("Update shining star error:", error);

    await removeTempFile(tempFilePath);

    return res.status(500).json({
      success: false,
      message: "Unable to update shining star.",
      error: error.message,
    });
  }
};

/* =========================================================
   ADMIN - DELETE
========================================================= */

export const deleteShiningStar = async (req, res) => {
  try {
    const star = await ShiningStar.findById(req.params.id);

    if (!star) {
      return res.status(404).json({
        success: false,
        message: "Shining star not found.",
      });
    }

    if (star.imagePublicId) {
      try {
        await deletePlacementImage(star.imagePublicId);
      } catch (error) {
        console.error("Cloudinary delete error:", error);
      }
    }

    await star.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Shining star deleted successfully.",
    });
  } catch (error) {
    console.error("Delete shining star error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete shining star.",
      error: error.message,
    });
  }
};

/* =========================================================
   ADMIN - TOGGLE STATUS
========================================================= */

export const toggleShiningStarStatus = async (req, res) => {
  try {
    const star = await ShiningStar.findById(req.params.id);

    if (!star) {
      return res.status(404).json({
        success: false,
        message: "Shining star not found.",
      });
    }

    star.isPublished = !star.isPublished;

    star.updatedBy = req.admin?._id || null;

    await star.save();

    return res.status(200).json({
      success: true,
      message: star.isPublished
        ? "Shining star published successfully."
        : "Shining star moved to draft.",
      data: star,
    });
  } catch (error) {
    console.error("Toggle shining star status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update shining star status.",
      error: error.message,
    });
  }
};
