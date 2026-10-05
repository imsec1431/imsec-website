import Alumni from "../models/Alumni.js";
import cloudinary4 from "../config/cloudinaryConfig4.js";
import fs from "fs";

// Create Alumni
export const createAlumni = async (req, res) => {
  try {
    const { name, course, company, order, isActive } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const result = await cloudinary4.uploader.upload(req.file.path, {
      folder: "alumni",
    });

    fs.unlinkSync(req.file.path);

    const alumni = await Alumni.create({
      name,
      course,
      company,
      image: result.secure_url,
      publicId: result.public_id,
      order,
      isActive,
    });

    res.status(201).json({
      success: true,
      data: alumni,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Alumni
export const getAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.find().sort({ order: 1 });

    res.json({
      success: true,
      count: alumni.length,
      data: alumni,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Alumni
export const getAlumniById = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    res.json({
      success: true,
      data: alumni,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Alumni
export const updateAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    let image = alumni.image;
    let publicId = alumni.publicId;

    if (req.file) {
      await cloudinary4.uploader.destroy(alumni.publicId);

      const result = await cloudinary4.uploader.upload(req.file.path, {
        folder: "alumni",
      });

      fs.unlinkSync(req.file.path);

      image = result.secure_url;
      publicId = result.public_id;
    }

    alumni.name = req.body.name;
    alumni.course = req.body.course;
    alumni.company = req.body.company;
    alumni.order = req.body.order;
    alumni.isActive = req.body.isActive;
    alumni.image = image;
    alumni.publicId = publicId;

    await alumni.save();

    res.json({
      success: true,
      data: alumni,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Alumni
export const deleteAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    await cloudinary4.uploader.destroy(alumni.publicId);

    await alumni.deleteOne();

    res.json({
      success: true,
      message: "Alumni deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
