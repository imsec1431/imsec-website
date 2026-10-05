import DepartmentFaculty from "../models/DepartmentFaculty.js";
import Department from "../models/Department.js";
import cloudinary3 from "../config/cloudinaryConfig3.js";
import fs from "fs/promises";

/* =========================================================
   HELPER
   CONVERT FORM DATA BOOLEAN
========================================================= */

const toBoolean = (value) => {
  return value === true || value === "true" || value === "1";
};

/* =========================================================
   HELPER
   UPLOAD FACULTY PHOTO TO EXISTING CLOUDINARY
========================================================= */

const uploadFacultyPhoto = async (file) => {
  if (!file) {
    return null;
  }

  try {
    const result = await cloudinary3.uploader.upload(file.path, {
      folder: "imsec/faculty",
      resource_type: "image",
    });

    /* =====================================================
       DELETE TEMPORARY MULTER FILE
    ===================================================== */

    try {
      await fs.unlink(file.path);
    } catch (unlinkError) {
      console.warn(
        "Temporary faculty photo could not be deleted:",
        unlinkError.message,
      );
    }

    return result.secure_url;
  } catch (error) {
    /* =====================================================
       DELETE TEMP FILE IF CLOUDINARY FAILS
    ===================================================== */

    try {
      await fs.unlink(file.path);
    } catch (unlinkError) {
      console.warn(
        "Temporary faculty photo could not be deleted:",
        unlinkError.message,
      );
    }

    throw error;
  }
};

/* =========================================================
   GET ALL FACULTY
   SUPER ADMIN
========================================================= */

export const getAllDepartmentFaculty = async (req, res) => {
  try {
    const faculty = await DepartmentFaculty.find()
      .populate("departmentId", "name code shortName slug")
      .sort({
        priority: 1,
        createdAt: 1,
      });

    res.status(200).json({
      success: true,
      count: faculty.length,
      data: faculty,
    });
  } catch (error) {
    console.error("Get All Department Faculty Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch faculty",
    });
  }
};

/* =========================================================
   GET FACULTY BY DEPARTMENT
========================================================= */

export const getDepartmentFaculty = async (req, res) => {
  try {
    const { departmentId } = req.params;

    /* =====================================================
       CHECK DEPARTMENT
    ===================================================== */

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    /* =====================================================
       GET FACULTY
    ===================================================== */

    const faculty = await DepartmentFaculty.find({
      departmentId,
    }).sort({
      priority: 1,
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      count: faculty.length,
      data: faculty,
    });
  } catch (error) {
    console.error("Get Department Faculty Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch department faculty",
    });
  }
};

/* =========================================================
   GET SINGLE FACULTY
========================================================= */

export const getFaculty = async (req, res) => {
  try {
    const faculty = await DepartmentFaculty.findById(req.params.id).populate(
      "departmentId",
      "name code shortName slug",
    );

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty member not found",
      });
    }

    res.status(200).json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    console.error("Get Faculty Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch faculty member",
    });
  }
};

/* =========================================================
   CREATE FACULTY
========================================================= */

export const createDepartmentFaculty = async (req, res) => {
  try {
    const {
      departmentId,
      name,
      designation,
      qualification,
      experience,
      specialization,
      description,
      email,
      phone,
      linkedinUrl,
      isHOD,
      priority,
      status,
    } = req.body;

    /* =====================================================
       DEPARTMENT VALIDATION
    ===================================================== */

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message: "Department is required",
      });
    }

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    /* =====================================================
       NAME VALIDATION
    ===================================================== */

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Faculty name is required",
      });
    }

    /* =====================================================
       DESIGNATION VALIDATION
    ===================================================== */

    if (!designation || !designation.trim()) {
      return res.status(400).json({
        success: false,
        message: "Faculty designation is required",
      });
    }

    /* =====================================================
       CONVERT HOD VALUE
    ===================================================== */

    const hodValue = toBoolean(isHOD);

    /* =====================================================
       ONLY ONE HOD PER DEPARTMENT
    ===================================================== */

    if (hodValue) {
      await DepartmentFaculty.updateMany(
        {
          departmentId,
          isHOD: true,
        },
        {
          $set: {
            isHOD: false,
          },
        },
      );
    }

    /* =====================================================
       UPLOAD PHOTO
    ===================================================== */

    let photoUrl = "";

    if (req.file) {
      photoUrl = await uploadFacultyPhoto(req.file);
    }

    /* =====================================================
       CREATE FACULTY
    ===================================================== */

    const faculty = await DepartmentFaculty.create({
      departmentId,

      name: name.trim(),

      designation: designation.trim(),

      qualification: qualification?.trim() || "",

      experience: experience?.trim() || "",

      specialization: specialization?.trim() || "",

      description: description?.trim() || "",

      photo: photoUrl,

      email: email?.trim().toLowerCase() || "",

      phone: phone?.trim() || "",

      linkedinUrl: linkedinUrl?.trim() || "",

      isHOD: hodValue,

      priority: Number(priority) || 1,

      status: status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "Faculty added successfully",
      data: faculty,
    });
  } catch (error) {
    console.error("Create Department Faculty Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add faculty",
    });
  }
};

/* =========================================================
   UPDATE FACULTY
========================================================= */

export const updateDepartmentFaculty = async (req, res) => {
  try {
    const {
      departmentId,
      name,
      designation,
      qualification,
      experience,
      specialization,
      description,
      email,
      phone,
      linkedinUrl,
      isHOD,
      priority,
      status,
    } = req.body;

    /* =====================================================
       FIND EXISTING FACULTY
    ===================================================== */

    const existingFaculty = await DepartmentFaculty.findById(req.params.id);

    if (!existingFaculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty member not found",
      });
    }

    /* =====================================================
       DEPARTMENT
    ===================================================== */

    const finalDepartmentId = departmentId || existingFaculty.departmentId;

    const department = await Department.findById(finalDepartmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    /* =====================================================
       NAME
    ===================================================== */

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Faculty name is required",
      });
    }

    /* =====================================================
       DESIGNATION
    ===================================================== */

    if (!designation || !designation.trim()) {
      return res.status(400).json({
        success: false,
        message: "Faculty designation is required",
      });
    }

    /* =====================================================
       HOD
    ===================================================== */

    const hodValue = toBoolean(isHOD);

    if (hodValue) {
      await DepartmentFaculty.updateMany(
        {
          departmentId: finalDepartmentId,

          _id: {
            $ne: req.params.id,
          },

          isHOD: true,
        },
        {
          $set: {
            isHOD: false,
          },
        },
      );
    }

    /* =====================================================
       PHOTO
       KEEP OLD PHOTO IF NEW PHOTO NOT PROVIDED
    ===================================================== */

    let photoUrl = existingFaculty.photo || "";

    if (req.file) {
      photoUrl = await uploadFacultyPhoto(req.file);
    }

    /* =====================================================
       UPDATE
    ===================================================== */

    const faculty = await DepartmentFaculty.findByIdAndUpdate(
      req.params.id,
      {
        departmentId: finalDepartmentId,

        name: name.trim(),

        designation: designation.trim(),

        qualification: qualification?.trim() || "",

        experience: experience?.trim() || "",

        specialization: specialization?.trim() || "",

        description: description?.trim() || "",

        photo: photoUrl,

        email: email?.trim().toLowerCase() || "",

        phone: phone?.trim() || "",

        linkedinUrl: linkedinUrl?.trim() || "",

        isHOD: hodValue,

        priority: Number(priority) || 1,

        status: status || "Active",
      },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Faculty updated successfully",
      data: faculty,
    });
  } catch (error) {
    console.error("Update Department Faculty Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update faculty",
    });
  }
};

/* =========================================================
   DELETE FACULTY
========================================================= */

export const deleteDepartmentFaculty = async (req, res) => {
  try {
    const faculty = await DepartmentFaculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty member not found",
      });
    }

    /* =====================================================
       DELETE FACULTY RECORD
    ===================================================== */

    await DepartmentFaculty.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Faculty deleted successfully",
    });
  } catch (error) {
    console.error("Delete Department Faculty Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete faculty",
    });
  }
};
/* =========================================================
   GET FACULTY BY DEPARTMENT SLUG
   PUBLIC WEBSITE
========================================================= */

export const getDepartmentFacultyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    /* =====================================================
       VALIDATE SLUG
    ===================================================== */

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Department slug is required",
      });
    }

    /* =====================================================
       FIND DEPARTMENT
    ===================================================== */

    const department = await Department.findOne({
      slug: slug.trim().toLowerCase(),
    }).select("_id name code shortName slug");

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    /* =====================================================
       GET FACULTY
    ===================================================== */

    const faculty = await DepartmentFaculty.find({
      departmentId: department._id,
      status: "Active",
    })
      .sort({
        priority: 1,
        createdAt: 1,
      })
      .lean();

    /* =====================================================
       PUBLIC RESPONSE
    ===================================================== */

    return res.status(200).json({
      success: true,
      count: faculty.length,
      department: {
        _id: department._id,
        name: department.name,
        code: department.code,
        shortName: department.shortName,
        slug: department.slug,
      },
      data: faculty,
    });
  } catch (error) {
    console.error("Get Public Department Faculty By Slug Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch department faculty",
    });
  }
};
