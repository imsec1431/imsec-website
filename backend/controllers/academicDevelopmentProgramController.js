import AcademicDevelopmentProgram from "../models/AcademicDevelopmentProgram.js";
import cloudinary from "../config/cloudinaryConfig.js";

// ======================================
// Add Program
// ======================================

export const addProgram = async (req, res) => {
  try {
    let image = "";
    let imagePublicId = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "academic-development-program",
      });

      image = result.secure_url;
      imagePublicId = result.public_id;
    }

    const program = await AcademicDevelopmentProgram.create({
      title: req.body.title,
      description: req.body.description,
      image,
      imagePublicId,
      date: req.body.date,
      venue: req.body.venue,
      status: req.body.status,
      registrationLink: req.body.registrationLink,
      detailsLink: req.body.detailsLink,
      facebookLink: req.body.facebookLink,
      instagramLink: req.body.instagramLink,
      linkedinLink: req.body.linkedinLink,
      youtubeLink: req.body.youtubeLink,
      twitterLink: req.body.twitterLink,
      galleryLink: req.body.galleryLink,
      active: req.body.active,
    });

    res.status(201).json({
      success: true,
      message: "Program Added Successfully",
      data: program,
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
// Get All Programs
// ======================================

export const getPrograms = async (req, res) => {
  try {
    const programs = await AcademicDevelopmentProgram.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: programs.length,
      data: programs,
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
// Get Single Program
// ======================================

export const getProgram = async (req, res) => {
  try {
    const program = await AcademicDevelopmentProgram.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    res.status(200).json({
      success: true,
      data: program,
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
// Update Program
// ======================================

export const updateProgram = async (req, res) => {
  try {
    const program = await AcademicDevelopmentProgram.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    if (req.file) {
      if (program.imagePublicId) {
        await cloudinary.uploader.destroy(program.imagePublicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "academic-development-program",
      });

      program.image = result.secure_url;
      program.imagePublicId = result.public_id;
    }

    program.title = req.body.title;
    program.description = req.body.description;
    program.date = req.body.date;
    program.venue = req.body.venue;
    program.status = req.body.status;
    program.registrationLink = req.body.registrationLink;
    program.detailsLink = req.body.detailsLink;
    program.facebookLink = req.body.facebookLink;
    program.instagramLink = req.body.instagramLink;
    program.linkedinLink = req.body.linkedinLink;
    program.youtubeLink = req.body.youtubeLink;
    program.twitterLink = req.body.twitterLink;
    program.galleryLink = req.body.galleryLink;
    program.active = req.body.active;

    await program.save();

    res.status(200).json({
      success: true,
      message: "Program Updated Successfully",
      data: program,
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
// Delete Program
// ======================================

export const deleteProgram = async (req, res) => {
  try {
    const program = await AcademicDevelopmentProgram.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    if (program.imagePublicId) {
      await cloudinary.uploader.destroy(program.imagePublicId);
    }

    await program.deleteOne();

    res.status(200).json({
      success: true,
      message: "Program Deleted Successfully",
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
