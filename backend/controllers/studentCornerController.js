import StudentCorner from "../models/StudentCorner.js";
import Department from "../models/Department.js";

/* =========================================================
   FIND DEPARTMENT
   Supports both:
   1. MongoDB ObjectId
   2. Department slug
========================================================= */

const findDepartment = async (departmentValue) => {
  if (!departmentValue) {
    return null;
  }

  /* -----------------------------------------------
     MongoDB ObjectId
  ----------------------------------------------- */

  if (/^[0-9a-fA-F]{24}$/.test(departmentValue)) {
    return await Department.findById(departmentValue);
  }

  /* -----------------------------------------------
     Department Slug
     Example:
     master-of-computer-application
  ----------------------------------------------- */

  return await Department.findOne({
    slug: departmentValue,
  });
};

/* =========================================================
   GOOGLE DRIVE LINK VALIDATION
========================================================= */

const isValidDriveLink = (link) => {
  if (!link || typeof link !== "string") {
    return false;
  }

  return link.includes("drive.google.com") || link.includes("docs.google.com");
};

/* =========================================================
   GET STUDENT CORNER
   GET /api/student-corner/:departmentId
========================================================= */

export const getStudentCorner = async (req, res) => {
  try {
    const { departmentId } = req.params;

    /* -----------------------------------------------
       FIND DEPARTMENT USING ID OR SLUG
    ----------------------------------------------- */

    const department = await findDepartment(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    /* -----------------------------------------------
       IMPORTANT:
       Always use the real MongoDB ObjectId
       from the Department document.
    ----------------------------------------------- */

    const studentCorner = await StudentCorner.findOne({
      departmentId: department._id,
    });

    /* -----------------------------------------------
       NOT CREATED YET
    ----------------------------------------------- */

    if (!studentCorner) {
      return res.status(200).json({
        success: true,
        exists: false,
        data: null,
      });
    }

    /* -----------------------------------------------
       SUCCESS
    ----------------------------------------------- */

    return res.status(200).json({
      success: true,
      exists: true,
      data: studentCorner,
    });
  } catch (error) {
    console.error("Get Student Corner Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch Student Corner",
    });
  }
};

/* =========================================================
   CREATE STUDENT CORNER
   POST /api/student-corner
========================================================= */

export const createStudentCorner = async (req, res) => {
  try {
    const { departmentId, notices, timeTables, syllabus, status } = req.body;

    /* ===============================================
       DEPARTMENT REQUIRED
    =============================================== */

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message: "Department is required",
      });
    }

    /* ===============================================
       FIND DEPARTMENT
       Supports slug + ObjectId
    =============================================== */

    const department = await findDepartment(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    /* ===============================================
       USE ACTUAL MONGODB DEPARTMENT ID
    =============================================== */

    const actualDepartmentId = department._id;

    /* ===============================================
       CHECK EXISTING
    =============================================== */

    const existing = await StudentCorner.findOne({
      departmentId: actualDepartmentId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Student Corner already exists for this department",
      });
    }

    /* ===============================================
       PARSE NOTICES
    =============================================== */

    let parsedNotices = [];

    if (notices) {
      try {
        parsedNotices =
          typeof notices === "string" ? JSON.parse(notices) : notices;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid notices data",
        });
      }
    }

    if (!Array.isArray(parsedNotices)) {
      parsedNotices = [];
    }

    /* ===============================================
       VALIDATE NOTICES
    =============================================== */

    parsedNotices = parsedNotices.map((item, index) => {
      if (!item.title?.trim()) {
        throw new Error(`Notice ${index + 1}: title is required`);
      }

      if (!item.driveLink?.trim()) {
        throw new Error(`Notice ${index + 1}: Google Drive link is required`);
      }

      if (!isValidDriveLink(item.driveLink.trim())) {
        throw new Error(`Notice ${index + 1}: invalid Google Drive link`);
      }

      return {
        title: item.title.trim(),

        date: item.date || new Date(),

        driveLink: item.driveLink.trim(),

        displayOrder: Number(item.displayOrder) || index + 1,

        isActive: item.isActive !== false,
      };
    });

    /* ===============================================
       PARSE TIME TABLES
    =============================================== */

    let parsedTimeTables = [];

    if (timeTables) {
      try {
        parsedTimeTables =
          typeof timeTables === "string" ? JSON.parse(timeTables) : timeTables;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid time table data",
        });
      }
    }

    if (!Array.isArray(parsedTimeTables)) {
      parsedTimeTables = [];
    }

    /* ===============================================
       VALIDATE TIME TABLES
    =============================================== */

    parsedTimeTables = parsedTimeTables.map((item, index) => {
      if (!item.semester?.trim()) {
        throw new Error(`Time Table ${index + 1}: semester is required`);
      }

      if (!item.title?.trim()) {
        throw new Error(`Time Table ${index + 1}: title is required`);
      }

      if (!item.driveLink?.trim()) {
        throw new Error(
          `Time Table ${index + 1}: Google Drive link is required`,
        );
      }

      if (!isValidDriveLink(item.driveLink.trim())) {
        throw new Error(`Time Table ${index + 1}: invalid Google Drive link`);
      }

      return {
        semester: item.semester.trim(),

        title: item.title.trim(),

        subtitle: item.subtitle?.trim() || "Class Time Table",

        driveLink: item.driveLink.trim(),

        displayOrder: Number(item.displayOrder) || index + 1,

        isActive: item.isActive !== false,
      };
    });

    /* ===============================================
       PARSE SYLLABUS
    =============================================== */

    let parsedSyllabus = [];

    if (syllabus) {
      try {
        parsedSyllabus =
          typeof syllabus === "string" ? JSON.parse(syllabus) : syllabus;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid syllabus data",
        });
      }
    }

    if (!Array.isArray(parsedSyllabus)) {
      parsedSyllabus = [];
    }

    /* ===============================================
       VALIDATE SYLLABUS
    =============================================== */

    parsedSyllabus = parsedSyllabus.map((item, index) => {
      if (!item.semester?.trim()) {
        throw new Error(`Syllabus ${index + 1}: semester is required`);
      }

      if (!item.title?.trim()) {
        throw new Error(`Syllabus ${index + 1}: title is required`);
      }

      if (!item.driveLink?.trim()) {
        throw new Error(`Syllabus ${index + 1}: Google Drive link is required`);
      }

      if (!isValidDriveLink(item.driveLink.trim())) {
        throw new Error(`Syllabus ${index + 1}: invalid Google Drive link`);
      }

      return {
        semester: item.semester.trim(),

        title: item.title.trim(),

        description: item.description?.trim() || "",

        driveLink: item.driveLink.trim(),

        displayOrder: Number(item.displayOrder) || index + 1,

        isActive: item.isActive !== false,
      };
    });

    /* ===============================================
       CREATE STUDENT CORNER
    =============================================== */

    const studentCorner = await StudentCorner.create({
      departmentId: actualDepartmentId,

      notices: parsedNotices,

      timeTables: parsedTimeTables,

      syllabus: parsedSyllabus,

      status: status === "Inactive" ? "Inactive" : "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Student Corner created successfully",
      data: studentCorner,
    });
  } catch (error) {
    console.error("Create Student Corner Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create Student Corner",
    });
  }
};

/* =========================================================
   UPDATE STUDENT CORNER
   PUT /api/student-corner/:departmentId
========================================================= */

export const updateStudentCorner = async (req, res) => {
  try {
    const { departmentId } = req.params;

    /* ===============================================
       FIND DEPARTMENT USING SLUG OR OBJECT ID
    =============================================== */

    const department = await findDepartment(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    /* ===============================================
       FIND STUDENT CORNER USING REAL OBJECT ID
    =============================================== */

    const studentCorner = await StudentCorner.findOne({
      departmentId: department._id,
    });

    if (!studentCorner) {
      return res.status(404).json({
        success: false,
        message: "Student Corner not found",
      });
    }

    const { notices, timeTables, syllabus, status } = req.body;

    /* ===============================================
       UPDATE NOTICES
    =============================================== */

    if (notices !== undefined) {
      let parsedNotices;

      try {
        parsedNotices =
          typeof notices === "string" ? JSON.parse(notices) : notices;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid notices data",
        });
      }

      if (!Array.isArray(parsedNotices)) {
        parsedNotices = [];
      }

      studentCorner.notices = parsedNotices.map((item, index) => {
        if (!item.title?.trim()) {
          throw new Error(`Notice ${index + 1}: title is required`);
        }

        if (!item.driveLink?.trim()) {
          throw new Error(`Notice ${index + 1}: Google Drive link is required`);
        }

        if (!isValidDriveLink(item.driveLink.trim())) {
          throw new Error(`Notice ${index + 1}: invalid Google Drive link`);
        }

        const cleaned = {
          title: item.title.trim(),

          date: item.date || new Date(),

          driveLink: item.driveLink.trim(),

          displayOrder: Number(item.displayOrder) || index + 1,

          isActive: item.isActive !== false,
        };

        /*
         * Only preserve a real
         * existing MongoDB _id.
         */
        if (
          item._id &&
          typeof item._id === "string" &&
          /^[0-9a-fA-F]{24}$/.test(item._id)
        ) {
          cleaned._id = item._id;
        }

        return cleaned;
      });
    }

    /* ===============================================
       UPDATE TIME TABLES
    =============================================== */

    if (timeTables !== undefined) {
      let parsedTimeTables;

      try {
        parsedTimeTables =
          typeof timeTables === "string" ? JSON.parse(timeTables) : timeTables;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid time table data",
        });
      }

      if (!Array.isArray(parsedTimeTables)) {
        parsedTimeTables = [];
      }

      studentCorner.timeTables = parsedTimeTables.map((item, index) => {
        if (!item.semester?.trim()) {
          throw new Error(`Time Table ${index + 1}: semester is required`);
        }

        if (!item.title?.trim()) {
          throw new Error(`Time Table ${index + 1}: title is required`);
        }

        if (!item.driveLink?.trim()) {
          throw new Error(
            `Time Table ${index + 1}: Google Drive link is required`,
          );
        }

        if (!isValidDriveLink(item.driveLink.trim())) {
          throw new Error(`Time Table ${index + 1}: invalid Google Drive link`);
        }

        const cleaned = {
          semester: item.semester.trim(),

          title: item.title.trim(),

          subtitle: item.subtitle?.trim() || "Class Time Table",

          driveLink: item.driveLink.trim(),

          displayOrder: Number(item.displayOrder) || index + 1,

          isActive: item.isActive !== false,
        };

        if (
          item._id &&
          typeof item._id === "string" &&
          /^[0-9a-fA-F]{24}$/.test(item._id)
        ) {
          cleaned._id = item._id;
        }

        return cleaned;
      });
    }

    /* ===============================================
       UPDATE SYLLABUS
    =============================================== */

    if (syllabus !== undefined) {
      let parsedSyllabus;

      try {
        parsedSyllabus =
          typeof syllabus === "string" ? JSON.parse(syllabus) : syllabus;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid syllabus data",
        });
      }

      if (!Array.isArray(parsedSyllabus)) {
        parsedSyllabus = [];
      }

      studentCorner.syllabus = parsedSyllabus.map((item, index) => {
        if (!item.semester?.trim()) {
          throw new Error(`Syllabus ${index + 1}: semester is required`);
        }

        if (!item.title?.trim()) {
          throw new Error(`Syllabus ${index + 1}: title is required`);
        }

        if (!item.driveLink?.trim()) {
          throw new Error(
            `Syllabus ${index + 1}: Google Drive link is required`,
          );
        }

        if (!isValidDriveLink(item.driveLink.trim())) {
          throw new Error(`Syllabus ${index + 1}: invalid Google Drive link`);
        }

        const cleaned = {
          semester: item.semester.trim(),

          title: item.title.trim(),

          description: item.description?.trim() || "",

          driveLink: item.driveLink.trim(),

          displayOrder: Number(item.displayOrder) || index + 1,

          isActive: item.isActive !== false,
        };

        if (
          item._id &&
          typeof item._id === "string" &&
          /^[0-9a-fA-F]{24}$/.test(item._id)
        ) {
          cleaned._id = item._id;
        }

        return cleaned;
      });
    }

    /* ===============================================
       UPDATE STATUS
    =============================================== */

    if (status !== undefined) {
      studentCorner.status = status === "Inactive" ? "Inactive" : "Active";
    }

    /* ===============================================
       SAVE
    =============================================== */

    await studentCorner.save();

    return res.status(200).json({
      success: true,
      message: "Student Corner updated successfully",
      data: studentCorner,
    });
  } catch (error) {
    console.error("Update Student Corner Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update Student Corner",
    });
  }
};

/* =========================================================
   DELETE STUDENT CORNER
   DELETE /api/student-corner/:departmentId
========================================================= */

export const deleteStudentCorner = async (req, res) => {
  try {
    const { departmentId } = req.params;

    /* ===============================================
       FIND DEPARTMENT USING SLUG OR OBJECT ID
    =============================================== */

    const department = await findDepartment(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    /* ===============================================
       FIND STUDENT CORNER
    =============================================== */

    const studentCorner = await StudentCorner.findOne({
      departmentId: department._id,
    });

    if (!studentCorner) {
      return res.status(404).json({
        success: false,
        message: "Student Corner not found",
      });
    }

    /* ===============================================
       DELETE
    =============================================== */

    await studentCorner.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Student Corner deleted successfully",
    });
  } catch (error) {
    console.error("Delete Student Corner Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete Student Corner",
    });
  }
};
