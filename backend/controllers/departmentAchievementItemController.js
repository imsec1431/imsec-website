import DepartmentAchievementItem from "../models/DepartmentAchievementItem.js";
import Department from "../models/Department.js";
import cloudinary4 from "../config/cloudinaryConfig4.js";

/* =========================================================
   GET ALL DEPARTMENT ACHIEVEMENTS
   Admin
   GET /api/department-achievement-items/department/:departmentId
========================================================= */

export const getDepartmentAchievementItems = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const items = await DepartmentAchievementItem.find({
      departmentId,
    }).sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Get Department Achievement Items Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch department achievements",
      error: error.message,
    });
  }
};

/* =========================================================
   GET ACTIVE DEPARTMENT ACHIEVEMENTS
   Public
   GET /api/department-achievement-items/public/:departmentId
========================================================= */

export const getPublicDepartmentAchievementItems = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const items = await DepartmentAchievementItem.find({
      departmentId,
      isActive: true,
    }).sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Get Public Department Achievement Items Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch department achievements",
      error: error.message,
    });
  }
};

/* =========================================================
   GET SINGLE DEPARTMENT ACHIEVEMENT
   GET /api/department-achievement-items/:id
========================================================= */

export const getDepartmentAchievementItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await DepartmentAchievementItem.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Department achievement not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Get Department Achievement By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch department achievement",
      error: error.message,
    });
  }
};

/* =========================================================
   CREATE DEPARTMENT ACHIEVEMENT
   POST /api/department-achievement-items
   multipart/form-data
========================================================= */

export const createDepartmentAchievementItem = async (req, res) => {
  try {
    const { departmentId, title, description, order, isActive } = req.body;

    /* ---------- Validation ---------- */

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message: "Department is required",
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

    /* ---------- Upload Image ---------- */

    let image = "";
    let publicId = "";

    if (req.file) {
      const uploadResult = await cloudinary4.uploader.upload(req.file.path, {
        folder: "department-achievements",
        resource_type: "image",
      });

      image = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    }

    /* ---------- Create ---------- */

    const achievement = await DepartmentAchievementItem.create({
      departmentId,
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

    return res.status(201).json({
      success: true,
      message: "Department achievement created successfully",
      data: achievement,
    });
  } catch (error) {
    console.error("Create Department Achievement Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create department achievement",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE DEPARTMENT ACHIEVEMENT
   PUT /api/department-achievement-items/:id
   multipart/form-data
========================================================= */

export const updateDepartmentAchievementItem = async (req, res) => {
  try {
    const { id } = req.params;

    const { departmentId, title, description, order, isActive } = req.body;

    /* ---------- Find Existing ---------- */

    const achievement = await DepartmentAchievementItem.findById(id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Department achievement not found",
      });
    }

    /* ---------- Validate Department ---------- */

    if (departmentId) {
      const department = await Department.findById(departmentId);

      if (!department) {
        return res.status(404).json({
          success: false,
          message: "Department not found",
        });
      }

      achievement.departmentId = departmentId;
    }

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
            "Old department achievement image delete error:",
            cloudinaryError,
          );
        }
      }

      const uploadResult = await cloudinary4.uploader.upload(req.file.path, {
        folder: "department-achievements",
        resource_type: "image",
      });

      achievement.image = uploadResult.secure_url;
      achievement.publicId = uploadResult.public_id;
    }

    /* ---------- Save ---------- */

    await achievement.save();

    return res.status(200).json({
      success: true,
      message: "Department achievement updated successfully",
      data: achievement,
    });
  } catch (error) {
    console.error("Update Department Achievement Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update department achievement",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE DEPARTMENT ACHIEVEMENT
   DELETE /api/department-achievement-items/:id
========================================================= */

export const deleteDepartmentAchievementItem = async (req, res) => {
  try {
    const { id } = req.params;

    const achievement = await DepartmentAchievementItem.findById(id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Department achievement not found",
      });
    }

    /* ---------- Delete Cloudinary Image ---------- */

    if (achievement.publicId) {
      try {
        await cloudinary4.uploader.destroy(achievement.publicId, {
          resource_type: "image",
        });
      } catch (cloudinaryError) {
        console.error("Cloudinary image delete error:", cloudinaryError);
      }
    }

    /* ---------- Delete Database Record ---------- */

    await DepartmentAchievementItem.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Department achievement deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete Department Achievement Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete department achievement",
      error: error.message,
    });
  }
};
