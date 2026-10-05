import ExecutiveCouncil from "../models/ExecutiveCouncil.js";
import cloudinary from "../config/cloudinaryConfig.js";

/* ==========================================
        Add Member
========================================== */

export const addMember = async (req, res) => {
  try {
    const { name, designation, linkedin, order } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Photo is required",
      });
    }

    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      folder: "executive-council",
    });

    const member = await ExecutiveCouncil.create({
      name,
      designation,
      linkedin,
      order,
      imageUrl: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    });

    res.status(201).json({
      success: true,
      message: "Member Added Successfully",
      data: member,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
        Get All Members
========================================== */

export const getMembers = async (req, res) => {
  try {
    const members = await ExecutiveCouncil.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
        Update Member
========================================== */

export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, designation, linkedin, order } = req.body;

    const member = await ExecutiveCouncil.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    if (req.file) {
      await cloudinary.uploader.destroy(member.publicId);

      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "executive-council",
      });

      member.imageUrl = uploadedImage.secure_url;
      member.publicId = uploadedImage.public_id;
    }

    member.name = name;
    member.designation = designation;
    member.linkedin = linkedin;
    member.order = order;

    await member.save();

    res.status(200).json({
      success: true,
      message: "Member Updated Successfully",
      data: member,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
        Delete Member
========================================== */

export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await ExecutiveCouncil.findById(id);

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
      message: "Member Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
