import DepartmentHodMessage from "../models/DepartmentHodMessage.js";
import Department from "../models/Department.js";
import DepartmentFaculty from "../models/DepartmentFaculty.js";

/* =========================================================
   GET HOD MESSAGE BY DEPARTMENT
========================================================= */

export const getHodMessage = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const hodMessage = await DepartmentHodMessage.findOne({
      departmentId,
    })
      .populate(
        "facultyId",
        "name designation qualification photo email phone linkedinUrl isHOD status",
      )
      .populate("departmentId", "name code shortName slug");

    if (!hodMessage) {
      return res.status(404).json({
        success: false,
        message: "HOD message not found for this department",
      });
    }

    res.status(200).json({
      success: true,
      data: hodMessage,
    });
  } catch (error) {
    console.error("Get HOD Message Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch HOD message",
    });
  }
};

/* =========================================================
   GET HOD MESSAGE BY DEPARTMENT SLUG
   PUBLIC WEBSITE
========================================================= */

export const getHodMessageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const department = await Department.findOne({
      slug,
      status: "Active",
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const hodMessage = await DepartmentHodMessage.findOne({
      departmentId: department._id,
      status: "Active",
    })
      .populate(
        "facultyId",
        "name designation qualification photo email phone linkedinUrl isHOD status",
      )
      .populate("departmentId", "name code shortName slug");

    if (!hodMessage) {
      return res.status(404).json({
        success: false,
        message: "HOD message not found",
      });
    }

    res.status(200).json({
      success: true,
      data: hodMessage,
    });
  } catch (error) {
    console.error("Get HOD Message By Slug Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch HOD message",
    });
  }
};

/* =========================================================
   CREATE HOD MESSAGE
========================================================= */

export const createHodMessage = async (req, res) => {
  try {
    const { departmentId, facultyId, title, message, status } = req.body;

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
       FACULTY VALIDATION
    ===================================================== */

    if (!facultyId) {
      return res.status(400).json({
        success: false,
        message: "HOD faculty is required",
      });
    }

    const faculty = await DepartmentFaculty.findOne({
      _id: facultyId,
      departmentId,
      status: "Active",
    });

    if (!faculty) {
      return res.status(400).json({
        success: false,
        message:
          "Selected faculty does not belong to this department or is inactive",
      });
    }

    /* =====================================================
       MUST BE HOD
    ===================================================== */

    if (!faculty.isHOD) {
      return res.status(400).json({
        success: false,
        message: "Selected faculty is not marked as HOD",
      });
    }

    /* =====================================================
       MESSAGE VALIDATION
    ===================================================== */

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "HOD message is required",
      });
    }

    /* =====================================================
       CHECK EXISTING MESSAGE
    ===================================================== */

    const existingMessage = await DepartmentHodMessage.findOne({
      departmentId,
    });

    if (existingMessage) {
      return res.status(400).json({
        success: false,
        message:
          "HOD message already exists for this department. Please update the existing message.",
      });
    }

    /* =====================================================
       CREATE
    ===================================================== */

    const hodMessage = await DepartmentHodMessage.create({
      departmentId,

      facultyId,

      title: title?.trim() || "Message from the Head of Department",

      message: message.trim(),

      status: status || "Active",
    });

    /* =====================================================
       RETURN POPULATED DATA
    ===================================================== */

    const populatedMessage = await DepartmentHodMessage.findById(hodMessage._id)
      .populate(
        "facultyId",
        "name designation qualification photo email phone linkedinUrl isHOD status",
      )
      .populate("departmentId", "name code shortName slug");

    res.status(201).json({
      success: true,
      message: "HOD message created successfully",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("Create HOD Message Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create HOD message",
    });
  }
};

/* =========================================================
   UPDATE HOD MESSAGE
========================================================= */

export const updateHodMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const { departmentId, facultyId, title, message, status } = req.body;

    /* =====================================================
       FIND MESSAGE
    ===================================================== */

    const existingMessage = await DepartmentHodMessage.findById(id);

    if (!existingMessage) {
      return res.status(404).json({
        success: false,
        message: "HOD message not found",
      });
    }

    /* =====================================================
       FINAL DEPARTMENT
    ===================================================== */

    const finalDepartmentId = departmentId || existingMessage.departmentId;

    const department = await Department.findById(finalDepartmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    /* =====================================================
       FINAL FACULTY
    ===================================================== */

    const finalFacultyId = facultyId || existingMessage.facultyId;

    const faculty = await DepartmentFaculty.findOne({
      _id: finalFacultyId,
      departmentId: finalDepartmentId,
      status: "Active",
    });

    if (!faculty) {
      return res.status(400).json({
        success: false,
        message:
          "Selected faculty does not belong to this department or is inactive",
      });
    }

    /* =====================================================
       MUST BE HOD
    ===================================================== */

    if (!faculty.isHOD) {
      return res.status(400).json({
        success: false,
        message: "Selected faculty is not marked as HOD",
      });
    }

    /* =====================================================
       MESSAGE
    ===================================================== */

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "HOD message is required",
      });
    }

    /* =====================================================
       UPDATE
    ===================================================== */

    const hodMessage = await DepartmentHodMessage.findByIdAndUpdate(
      id,
      {
        departmentId: finalDepartmentId,

        facultyId: finalFacultyId,

        title: title?.trim() || "Message from the Head of Department",

        message: message.trim(),

        status: status || "Active",
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate(
        "facultyId",
        "name designation qualification photo email phone linkedinUrl isHOD status",
      )
      .populate("departmentId", "name code shortName slug");

    res.status(200).json({
      success: true,
      message: "HOD message updated successfully",
      data: hodMessage,
    });
  } catch (error) {
    console.error("Update HOD Message Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update HOD message",
    });
  }
};

/* =========================================================
   DELETE HOD MESSAGE
========================================================= */

export const deleteHodMessage = async (req, res) => {
  try {
    const hodMessage = await DepartmentHodMessage.findByIdAndDelete(
      req.params.id,
    );

    if (!hodMessage) {
      return res.status(404).json({
        success: false,
        message: "HOD message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "HOD message deleted successfully",
    });
  } catch (error) {
    console.error("Delete HOD Message Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete HOD message",
    });
  }
};
