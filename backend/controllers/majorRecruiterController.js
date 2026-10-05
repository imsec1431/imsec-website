import MajorRecruiter from "../models/majorRecruiterModel.js";
import { uploadPlacementImage, deletePlacementImage } from "../config/placementCloudinary2.js";

/* =========================================================
   CLOUDINARY FOLDER
========================================================= */

const CLOUDINARY_FOLDER = "imsec/major-recruiters";

/* =========================================================
   GET PUBLIC MAJOR RECRUITERS
========================================================= */

export const getPublicMajorRecruiters = async (req, res) => {
  try {
    const recruiters = await MajorRecruiter.find({
      isPublished: true,
    })
      .sort({
        order: 1,
        companyName: 1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      data: recruiters,
    });
  } catch (error) {
    console.error("Get public major recruiters error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load major recruiters.",
    });
  }
};

/* =========================================================
   GET ALL MAJOR RECRUITERS - ADMIN
========================================================= */

export const getAdminMajorRecruiters = async (req, res) => {
  try {
    const recruiters = await MajorRecruiter.find()
      .sort({
        order: 1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      data: recruiters,
    });
  } catch (error) {
    console.error("Get admin major recruiters error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load major recruiters.",
    });
  }
};

/* =========================================================
   CREATE MAJOR RECRUITER
========================================================= */

export const createMajorRecruiter = async (req, res) => {
  try {
    const {
      companyName,
      imageAlt,
      logoAlt,
      website,
      description,
      category,
      order,
      isPublished,
    } = req.body;

    /* =========================================
       VALIDATE COMPANY
    ========================================= */

    if (!companyName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company name is required.",
      });
    }

    /* =========================================
       CHECK DUPLICATE
    ========================================= */

    const existingRecruiter = await MajorRecruiter.findOne({
      companyName: companyName.trim(),
    });

    if (existingRecruiter) {
      return res.status(409).json({
        success: false,
        message: "This company already exists.",
      });
    }

    /* =========================================
       UPLOAD LOGO
    ========================================= */

    let logo = "";
    let logoPublicId = "";

    if (req.file) {
      if (!req.file.path) {
        return res.status(400).json({
          success: false,
          message: "Uploaded image path is missing.",
        });
      }

      const uploadResult = await uploadPlacementImage(req.file.path, CLOUDINARY_FOLDER);

      logo = uploadResult.secure_url;

      logoPublicId = uploadResult.public_id;
    }

    /* =========================================
       CREATE DOCUMENT
    ========================================= */

    const recruiter = await MajorRecruiter.create({
      companyName: companyName.trim(),

      logo,

      logoPublicId,

      logoAlt: (imageAlt || logoAlt || "").trim(),

      website: website?.trim() || "",

      description: description?.trim() || "",

      category: category || "major-recruiter",

      order: Number(order) || 0,

      isPublished:
        isPublished === undefined
          ? true
          : isPublished === "true" || isPublished === true,

      createdBy: req.admin?._id || req.user?._id || null,
    });

    return res.status(201).json({
      success: true,

      message: "Major recruiter created successfully.",

      data: recruiter,
    });
  } catch (error) {
    console.error("Create major recruiter error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to create major recruiter.",

      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/* =========================================================
   UPDATE MAJOR RECRUITER
========================================================= */

export const updateMajorRecruiter = async (req, res) => {
  try {
    const {
      companyName,
      imageAlt,
      logoAlt,
      website,
      description,
      category,
      order,
      isPublished,
    } = req.body;

    /* =========================================
       FIND RECRUITER
    ========================================= */

    const recruiter = await MajorRecruiter.findById(req.params.id);

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Major recruiter not found.",
      });
    }

    /* =========================================
       DUPLICATE COMPANY
    ========================================= */

    if (companyName?.trim() && companyName.trim() !== recruiter.companyName) {
      const duplicate = await MajorRecruiter.findOne({
        companyName: companyName.trim(),

        _id: {
          $ne: recruiter._id,
        },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Another recruiter with this company name already exists.",
        });
      }
    }

    /* =========================================
       BASIC INFORMATION
    ========================================= */

    if (companyName !== undefined) {
      if (!companyName.trim()) {
        return res.status(400).json({
          success: false,
          message: "Company name is required.",
        });
      }

      recruiter.companyName = companyName.trim();
    }

    if (imageAlt !== undefined || logoAlt !== undefined) {
      recruiter.logoAlt = (imageAlt ?? logoAlt ?? "").trim();
    }

    if (website !== undefined) {
      recruiter.website = website.trim();
    }

    if (description !== undefined) {
      recruiter.description = description.trim();
    }

    if (category !== undefined) {
      recruiter.category = category;
    }

    if (order !== undefined) {
      recruiter.order = Number(order) || 0;
    }

    if (isPublished !== undefined) {
      recruiter.isPublished = isPublished === "true" || isPublished === true;
    }

    /* =========================================
       NEW LOGO
    ========================================= */

    if (req.file) {
      if (!req.file.path) {
        return res.status(400).json({
          success: false,
          message: "Uploaded image path is missing.",
        });
      }

      /* =======================================
         UPLOAD NEW LOGO
      ======================================= */

      const uploadResult = await uploadPlacementImage(req.file.path, CLOUDINARY_FOLDER);

      /* =======================================
         DELETE OLD LOGO
      ======================================= */

      if (recruiter.logoPublicId) {
        try {
          await deletePlacementImage(recruiter.logoPublicId);
        } catch (cloudinaryError) {
          console.error("Old recruiter logo deletion error:", cloudinaryError);
        }
      }

      /* =======================================
         SAVE NEW LOGO
      ======================================= */

      recruiter.logo = uploadResult.secure_url;

      recruiter.logoPublicId = uploadResult.public_id;
    }

    /* =========================================
       UPDATED BY
    ========================================= */

    recruiter.updatedBy = req.admin?._id || req.user?._id || null;

    /* =========================================
       SAVE
    ========================================= */

    await recruiter.save();

    return res.status(200).json({
      success: true,

      message: "Major recruiter updated successfully.",

      data: recruiter,
    });
  } catch (error) {
    console.error("Update major recruiter error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to update major recruiter.",

      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/* =========================================================
   DELETE MAJOR RECRUITER
========================================================= */

export const deleteMajorRecruiter = async (req, res) => {
  try {
    const recruiter = await MajorRecruiter.findById(req.params.id);

    /* =========================================
       CHECK EXISTENCE
    ========================================= */

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Major recruiter not found.",
      });
    }

    /* =========================================
       DELETE CLOUDINARY LOGO
    ========================================= */

    if (recruiter.logoPublicId) {
      try {
        await deletePlacementImage(recruiter.logoPublicId);
      } catch (cloudinaryError) {
        console.error("Recruiter logo deletion error:", cloudinaryError);
      }
    }

    /* =========================================
       DELETE DATABASE RECORD
    ========================================= */

    await MajorRecruiter.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,

      message: "Major recruiter deleted successfully.",
    });
  } catch (error) {
    console.error("Delete major recruiter error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to delete major recruiter.",
    });
  }
};
