import GoverningCouncil from "../models/GoverningCouncil.js";
import cloudinary from "../config/cloudinaryConfig.js";

// =============================
// Add Member
// =============================
export const addMember = async (req, res) => {
  try {
    const { name, designation, nominatedBy, linkedin, order } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Photo is required",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "governing-council",
    });

    const member = await GoverningCouncil.create({
      name,
      designation,
      nominatedBy,
      linkedin,
      order,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });

    res.status(201).json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get Members
// =============================
export const getMembers = async (req, res) => {
  try {
    const members = await GoverningCouncil.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Update Member
// =============================
export const updateMember = async (req, res) => {
  try {
    const member = await GoverningCouncil.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const { name, designation, nominatedBy, linkedin, order } = req.body;

    member.name = name;
    member.designation = designation;
    member.nominatedBy = nominatedBy;
    member.linkedin = linkedin;
    member.order = order;

    if (req.file) {
      await cloudinary.uploader.destroy(member.publicId);

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "governing-council",
      });

      member.imageUrl = result.secure_url;
      member.publicId = result.public_id;
    }

    await member.save();

    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Delete Member
// =============================
export const deleteMember = async (req, res) => {
  try {
    const member = await GoverningCouncil.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    await cloudinary.uploader.destroy(member.publicId);

    await member.deleteOne();

    res.status(200).json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
