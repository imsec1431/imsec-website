import FacultyAchievementItem from "../models/FacultyAchievementItem.js";
import Department from "../models/Department.js";
import DepartmentFaculty from "../models/DepartmentFaculty.js";
import cloudinary4 from "../config/cloudinaryConfig4.js";

/* =========================================================
   GET ALL FACULTY ACHIEVEMENTS
   Admin
   GET /api/faculty-achievement-items/department/:departmentId
========================================================= */

export const getFacultyAchievementItems = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const items = await FacultyAchievementItem.find({
      departmentId,
    })
      .populate("facultyId", "name designation photo")
      .sort({
        order: 1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Get Faculty Achievement Items Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch faculty achievements",
      error: error.message,
    });
  }
};

/* =========================================================
   GET ACTIVE FACULTY ACHIEVEMENTS
   Public
   GET /api/faculty-achievement-items/public/:departmentId
========================================================= */

export const getPublicFacultyAchievementItems = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const items = await FacultyAchievementItem.find({
      departmentId,
      isActive: true,
    })
      .populate("facultyId", "name designation photo")
      .sort({
        order: 1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Get Public Faculty Achievement Items Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch faculty achievements",
      error: error.message,
    });
  }
};

/* =========================================================
   GET SINGLE FACULTY ACHIEVEMENT
   GET /api/faculty-achievement-items/:id
========================================================= */

export const getFacultyAchievementItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await FacultyAchievementItem.findById(id).populate(
      "facultyId",
      "name designation photo",
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Faculty achievement not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Get Faculty Achievement By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch faculty achievement",
      error: error.message,
    });
  }
};

/* =========================================================
   CREATE FACULTY ACHIEVEMENT
   POST /api/faculty-achievement-items
   multipart/form-data
========================================================= */

export const createFacultyAchievementItem = async (req, res) => {
  try {
    const { departmentId, facultyId, title, description, order, isActive } =
      req.body;

    /* ---------- Validation ---------- */

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message: "Department is required",
      });
    }

    if (!facultyId) {
      return res.status(400).json({
        success: false,
        message: "Faculty member is required",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    /* ---------- Check Department ---------- */

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    /* ---------- Check Faculty ---------- */

    const faculty = await DepartmentFaculty.findById(facultyId);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty member not found",
      });
    }

    /* ---------- Make Sure Faculty Belongs To Department ---------- */

    if (faculty.departmentId.toString() !== departmentId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Selected faculty member does not belong to this department",
      });
    }

    /* ---------- Upload Image ---------- */

    let image = "";
    let publicId = "";

    if (req.file) {
      const uploadResult = await cloudinary4.uploader.upload(req.file.path, {
        folder: "faculty-achievements",
        resource_type: "image",
      });

      image = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    }

    /* ---------- Create ---------- */

    const achievement = await FacultyAchievementItem.create({
      departmentId,
      facultyId,
      title: title.trim(),
      description: description.trim(),
      image,
      publicId,
      order:
        order !== undefined && order !== "" && !Number.isNaN(Number(order))
          ? Number(order)
          : 1,
      isActive:
        isActive === undefined
          ? true
          : isActive === "true" || isActive === true,
    });

    /* ---------- Populate Faculty ---------- */

    const populatedAchievement = await FacultyAchievementItem.findById(
      achievement._id,
    ).populate("facultyId", "name designation photo");

    return res.status(201).json({
      success: true,
      message: "Faculty achievement created successfully",
      data: populatedAchievement,
    });
  } catch (error) {
    console.error("Create Faculty Achievement Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create faculty achievement",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE FACULTY ACHIEVEMENT
   PUT /api/faculty-achievement-items/:id
   multipart/form-data
========================================================= */

export const updateFacultyAchievementItem = async (req, res) => {
  try {
    const { id } = req.params;

    const { departmentId, facultyId, title, description, order, isActive } =
      req.body;

    /* ---------- Find Existing ---------- */

    const achievement = await FacultyAchievementItem.findById(id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Faculty achievement not found",
      });
    }

    const finalDepartmentId = departmentId || achievement.departmentId;

    const finalFacultyId = facultyId || achievement.facultyId;

    /* ---------- Check Department ---------- */

    const department = await Department.findById(finalDepartmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    /* ---------- Check Faculty ---------- */

    const faculty = await DepartmentFaculty.findById(finalFacultyId);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty member not found",
      });
    }

    /* ---------- Faculty Department Validation ---------- */

    if (faculty.departmentId.toString() !== finalDepartmentId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Selected faculty member does not belong to this department",
      });
    }

    /* ---------- Update Department ---------- */

    achievement.departmentId = finalDepartmentId;

    /* ---------- Update Faculty ---------- */

    achievement.facultyId = finalFacultyId;

    /* ---------- Update Title ---------- */

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        });
      }

      achievement.title = title.trim();
    }

    /* ---------- Update Description ---------- */

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          success: false,
          message: "Description cannot be empty",
        });
      }

      achievement.description = description.trim();
    }

    /* ---------- Update Order ---------- */

    if (order !== undefined && order !== "") {
      const numericOrder = Number(order);

      if (!Number.isNaN(numericOrder)) {
        achievement.order = numericOrder;
      }
    }

    /* ---------- Update Status ---------- */

    if (isActive !== undefined) {
      achievement.isActive = isActive === "true" || isActive === true;
    }

    /* ---------- Replace Image ---------- */

    if (req.file) {
      if (achievement.publicId) {
        try {
          await cloudinary4.uploader.destroy(achievement.publicId, {
            resource_type: "image",
          });
        } catch (cloudinaryError) {
          console.error(
            "Old faculty achievement image delete error:",
            cloudinaryError,
          );
        }
      }

      const uploadResult = await cloudinary4.uploader.upload(req.file.path, {
        folder: "faculty-achievements",
        resource_type: "image",
      });

      achievement.image = uploadResult.secure_url;
      achievement.publicId = uploadResult.public_id;
    }

    /* ---------- Save ---------- */

    await achievement.save();

    /* ---------- Populate Faculty ---------- */

    const populatedAchievement = await FacultyAchievementItem.findById(
      achievement._id,
    ).populate("facultyId", "name designation photo");

    return res.status(200).json({
      success: true,
      message: "Faculty achievement updated successfully",
      data: populatedAchievement,
    });
  } catch (error) {
    console.error("Update Faculty Achievement Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update faculty achievement",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE FACULTY ACHIEVEMENT
   DELETE /api/faculty-achievement-items/:id
========================================================= */

export const deleteFacultyAchievementItem = async (req, res) => {
  try {
    const { id } = req.params;

    const achievement = await FacultyAchievementItem.findById(id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Faculty achievement not found",
      });
    }

    /* ---------- Delete Cloudinary Image ---------- */

    if (achievement.publicId) {
      try {
        await cloudinary4.uploader.destroy(achievement.publicId, {
          resource_type: "image",
        });
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary faculty achievement image delete error:",
          cloudinaryError,
        );
      }
    }

    /* ---------- Delete Database Record ---------- */

    await FacultyAchievementItem.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Faculty achievement deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete Faculty Achievement Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete faculty achievement",
      error: error.message,
    });
  }
};
