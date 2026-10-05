import fs from "fs";
import cloudinary4 from "../config/cloudinaryConfig4.js";
import Placement from "../models/Placement.js";

/* ===========================================================
   Create Placement
=========================================================== */

export const createPlacement = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image.",
      });
    }

    const result = await cloudinary4.uploader.upload(req.file.path, {
      folder: "placements",
    });

    fs.unlinkSync(req.file.path);

    const placement = await Placement.create({
      studentName: req.body.studentName,
      course: req.body.course,
      batch: req.body.batch,
      company: req.body.company,
      package: req.body.package,
      order: req.body.order || 1,
      isActive: req.body.isActive === "false" ? false : true,
      image: result.secure_url,
      publicId: result.public_id,
    });

    res.status(201).json({
      success: true,
      data: placement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================================
   Get All Placements
=========================================================== */

export const getPlacements = async (req, res) => {
  try {
    const placements = await Placement.find().sort({
      order: 1,
    });

    res.status(200).json({
      success: true,
      count: placements.length,
      data: placements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================================
   Get Single Placement
=========================================================== */

export const getPlacementById = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: "Placement record not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: placement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================================
   Update Placement
=========================================================== */

export const updatePlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: "Placement record not found.",
      });
    }

    let image = placement.image;
    let publicId = placement.publicId;

    // If new image uploaded
    if (req.file) {
      if (placement.publicId) {
        await cloudinary4.uploader.destroy(placement.publicId);
      }

      const result = await cloudinary4.uploader.upload(req.file.path, {
        folder: "placements",
      });

      fs.unlinkSync(req.file.path);

      image = result.secure_url;
      publicId = result.public_id;
    }

    placement.studentName = req.body.studentName || placement.studentName;

    placement.course = req.body.course || placement.course;

    placement.batch = req.body.batch || placement.batch;

    placement.company = req.body.company || placement.company;

    placement.package = req.body.package || placement.package;

    placement.order = req.body.order || placement.order;

    placement.isActive = req.body.isActive === "false" ? false : true;

    placement.image = image;
    placement.publicId = publicId;

    await placement.save();

    res.status(200).json({
      success: true,
      data: placement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================================
   Delete Placement
=========================================================== */

export const deletePlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: "Placement record not found.",
      });
    }

    if (placement.publicId) {
      await cloudinary4.uploader.destroy(placement.publicId);
    }

    await Placement.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Placement deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
