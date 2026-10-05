import CDCTeam from "../models/CDCTeam.js";
import { uploadPlacementImage, deletePlacementImage } from "../config/placementCloudinary2.js";

/* =========================================
   GET PUBLIC CDC TEAM
========================================= */

export const getPublicCDCTeam = async (req, res) => {
  try {
    const members = await CDCTeam.find({
      isPublished: true,
    })
      .sort({
        role: 1,
        order: 1,
        createdAt: 1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error) {
    console.error("Get Public CDC Team Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load CDC Team",
    });
  }
};

/* =========================================
   GET ADMIN CDC TEAM
========================================= */

export const getAdminCDCTeam = async (req, res) => {
  try {
    const members = await CDCTeam.find()
      .sort({
        role: 1,
        order: 1,
        createdAt: 1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error) {
    console.error("Get Admin CDC Team Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load CDC Team",
    });
  }
};

/* =========================================
   CREATE CDC TEAM MEMBER
========================================= */

export const createCDCTeamMember = async (req, res) => {
  try {
    const {
      name,
      designation,
      role,
      qualification,
      experience,
      email,
      phone,
      linkedin,
      imageAlt,
      message,
      description,
      order,
      isPublished,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    if (!designation?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Designation is required.",
      });
    }

    let image = "";
    let imagePublicId = "";

    /* =====================================
       CLOUDINARY IMAGE
    ===================================== */

    if (req.file) {
      const uploadResult = await uploadPlacementImage(req.file.path, "imsec/cdc-team");

      image = uploadResult.secure_url;

      imagePublicId = uploadResult.public_id;
    }

    /* =====================================
       CREATE
    ===================================== */

    const member = await CDCTeam.create({
      name: name.trim(),

      designation: designation.trim(),

      role: role || "placement-officer",

      qualification: qualification?.trim() || "",

      experience: experience?.trim() || "",

      email: email?.trim() || "",

      phone: phone?.trim() || "",

      linkedin: linkedin?.trim() || "",

      image,

      imagePublicId,

      imageAlt: imageAlt?.trim() || "",

      message: message?.trim() || "",

      description: description?.trim() || "",

      order: order !== undefined ? Number(order) : 0,

      isPublished:
        isPublished !== undefined
          ? isPublished === true || isPublished === "true"
          : true,
    });

    return res.status(201).json({
      success: true,
      message: "CDC Team member created successfully.",
      data: member,
    });
  } catch (error) {
    console.error("Create CDC Team Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create CDC Team member.",
    });
  }
};

/* =========================================
   UPDATE CDC TEAM MEMBER
========================================= */

export const updateCDCTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await CDCTeam.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "CDC Team member not found.",
      });
    }

    const {
      name,
      designation,
      role,
      qualification,
      experience,
      email,
      phone,
      linkedin,
      imageAlt,
      message,
      description,
      order,
      isPublished,
    } = req.body;

    /* =====================================
       UPDATE FIELDS
    ===================================== */

    if (name !== undefined) {
      member.name = name.trim();
    }

    if (designation !== undefined) {
      member.designation = designation.trim();
    }

    if (role !== undefined) {
      member.role = role;
    }

    if (qualification !== undefined) {
      member.qualification = qualification.trim();
    }

    if (experience !== undefined) {
      member.experience = experience.trim();
    }

    if (email !== undefined) {
      member.email = email.trim();
    }

    if (phone !== undefined) {
      member.phone = phone.trim();
    }

    if (linkedin !== undefined) {
      member.linkedin = linkedin.trim();
    }

    if (imageAlt !== undefined) {
      member.imageAlt = imageAlt.trim();
    }

    if (message !== undefined) {
      member.message = message.trim();
    }

    if (description !== undefined) {
      member.description = description.trim();
    }

    if (order !== undefined) {
      member.order = Number(order);
    }

    if (isPublished !== undefined) {
      member.isPublished = isPublished === true || isPublished === "true";
    }

    /* =====================================
       NEW IMAGE
    ===================================== */

    if (req.file) {
      const uploadResult = await uploadPlacementImage(req.file.path, "imsec/cdc-team");

      /* DELETE OLD IMAGE */

      if (member.imagePublicId) {
        try {
          await deletePlacementImage(member.imagePublicId);
        } catch (cloudinaryError) {
          console.error("Old CDC Team image delete error:", cloudinaryError);
        }
      }

      member.image = uploadResult.secure_url;

      member.imagePublicId = uploadResult.public_id;
    }

    await member.save();

    return res.status(200).json({
      success: true,
      message: "CDC Team member updated successfully.",
      data: member,
    });
  } catch (error) {
    console.error("Update CDC Team Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update CDC Team member.",
    });
  }
};

/* =========================================
   DELETE CDC TEAM MEMBER
========================================= */

export const deleteCDCTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await CDCTeam.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "CDC Team member not found.",
      });
    }

    /* =====================================
       DELETE CLOUDINARY IMAGE
    ===================================== */

    if (member.imagePublicId) {
      try {
        await deletePlacementImage(member.imagePublicId);
      } catch (cloudinaryError) {
        console.error("CDC Team Cloudinary delete error:", cloudinaryError);
      }
    }

    await member.deleteOne();

    return res.status(200).json({
      success: true,
      message: "CDC Team member deleted successfully.",
    });
  } catch (error) {
    console.error("Delete CDC Team Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete CDC Team member.",
    });
  }
};
