import DepartmentAchievement from "../models/DepartmentAchievement.js";
import Department from "../models/Department.js";

/* =========================================================
   GET ACHIEVEMENTS BY DEPARTMENT
   GET /api/department-achievements/:departmentId
========================================================= */

export const getDepartmentAchievements = async (req, res) => {
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
       GET ACHIEVEMENTS
    ===================================================== */

    const achievements = await DepartmentAchievement.findOne({
      departmentId,
    });

    /* =====================================================
       NOT CREATED YET
    ===================================================== */

    if (!achievements) {
      return res.status(200).json({
        success: true,
        exists: false,
        data: null,
        department,
        message: "Department achievements have not been created yet",
      });
    }

    /* =====================================================
       RESPONSE
    ===================================================== */

    res.status(200).json({
      success: true,
      exists: true,
      data: achievements,
      department,
    });
  } catch (error) {
    console.error("Get Department Achievements Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch department achievements",
    });
  }
};

/* =========================================================
   GET ACHIEVEMENTS BY DEPARTMENT SLUG

   GET
   /api/department-achievements/slug/:slug
========================================================= */

export const getDepartmentAchievementsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || !slug.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department slug is required",
      });
    }

    const searchValue = slug.trim();

    /* ===================================================
         FIND BY SLUG
      =================================================== */

    let department = await Department.findOne({
      slug: {
        $regex: `^${searchValue}$`,
        $options: "i",
      },
    });

    /* ===================================================
         FALLBACK — CODE
      =================================================== */

    if (!department) {
      department = await Department.findOne({
        code: {
          $regex: `^${searchValue}$`,
          $options: "i",
        },
      });
    }

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    /* ===================================================
         FIND ACHIEVEMENTS
      =================================================== */

    const achievements = await DepartmentAchievement.findOne({
      departmentId: department._id,
    });

    /* ===================================================
         NOT CREATED YET
      =================================================== */

    if (!achievements) {
      return res.status(200).json({
        success: true,
        exists: false,
        data: null,
        department,
        message: "Department achievements have not been created yet",
      });
    }

    /* ===================================================
         RESPONSE
      =================================================== */

    res.status(200).json({
      success: true,
      exists: true,
      data: achievements,
      department,
    });
  } catch (error) {
    console.error("Get Department Achievements By Slug Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch department achievements",
    });
  }
};

/* =========================================================
   CREATE ACHIEVEMENTS

   POST /api/department-achievements
========================================================= */

export const createDepartmentAchievements = async (req, res) => {
  try {
    const {
      departmentId,
      collegeBranchToppers,
      globalAchievements,
      internships,
    } = req.body;

    /* ===================================================
         DEPARTMENT VALIDATION
      =================================================== */

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

    /* ===================================================
         CHECK EXISTING RECORD
      =================================================== */

    const existing = await DepartmentAchievement.findOne({
      departmentId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Department achievements already exist",
      });
    }

    /* ===================================================
         CREATE
      =================================================== */

    const achievements = await DepartmentAchievement.create({
      departmentId,

      collegeBranchToppers: Array.isArray(collegeBranchToppers)
        ? collegeBranchToppers
        : [],

      globalAchievements: Array.isArray(globalAchievements)
        ? globalAchievements
        : [],

      internships: Array.isArray(internships) ? internships : [],
    });

    res.status(201).json({
      success: true,
      message: "Department achievements created successfully",
      data: achievements,
    });
  } catch (error) {
    console.error("Create Department Achievements Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create department achievements",
    });
  }
};

/* =========================================================
   UPDATE ACHIEVEMENTS

   PUT
   /api/department-achievements/:departmentId
========================================================= */

export const updateDepartmentAchievements = async (req, res) => {
  try {
    const { collegeBranchToppers, globalAchievements, internships } = req.body;

    /* ===================================================
         FIND EXISTING
      =================================================== */

    const existing = await DepartmentAchievement.findOne({
      departmentId: req.params.departmentId,
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Department achievements not found",
      });
    }

    /* ===================================================
         UPDATE
      =================================================== */

    const achievements = await DepartmentAchievement.findOneAndUpdate(
      {
        departmentId: req.params.departmentId,
      },
      {
        collegeBranchToppers: Array.isArray(collegeBranchToppers)
          ? collegeBranchToppers
          : [],

        globalAchievements: Array.isArray(globalAchievements)
          ? globalAchievements
          : [],

        internships: Array.isArray(internships) ? internships : [],
      },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Department achievements updated successfully",
      data: achievements,
    });
  } catch (error) {
    console.error("Update Department Achievements Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update department achievements",
    });
  }
};

/* =========================================================
   DELETE ACHIEVEMENTS

   DELETE
   /api/department-achievements/:departmentId
========================================================= */

export const deleteDepartmentAchievements = async (req, res) => {
  try {
    const achievements = await DepartmentAchievement.findOneAndDelete({
      departmentId: req.params.departmentId,
    });

    if (!achievements) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "Department achievements not created yet",
      });
    }

    res.status(200).json({
      success: true,
      message: "Department achievements deleted successfully",
    });
  } catch (error) {
    console.error("Delete Department Achievements Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete department achievements",
    });
  }
};
