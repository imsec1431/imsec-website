import DepartmentPlacement from "../models/DepartmentPlacement.js";
import Department from "../models/Department.js";

/* =========================================================
   GET PLACEMENT BY DEPARTMENT
   GET /api/department-placement/:departmentId
========================================================= */

export const getDepartmentPlacement = async (req, res) => {
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
       FIND PLACEMENT
    ===================================================== */

    const placement = await DepartmentPlacement.findOne({
      departmentId,
    });

    /* =====================================================
       NOT CREATED YET
    ===================================================== */

    if (!placement) {
      return res.status(200).json({
        success: true,
        exists: false,
        data: null,
        department,
        message: "Department placement has not been created yet",
      });
    }

    /* =====================================================
       RESPONSE
    ===================================================== */

    res.status(200).json({
      success: true,
      exists: true,
      data: placement,
      department,
    });
  } catch (error) {
    console.error("Get Department Placement Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch department placement",
    });
  }
};

/* =========================================================
   GET PLACEMENT BY DEPARTMENT SLUG

   GET /api/department-placement/slug/:slug
========================================================= */

export const getDepartmentPlacementBySlug = async (req, res) => {
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
         FIND PLACEMENT
      =================================================== */

    const placement = await DepartmentPlacement.findOne({
      departmentId: department._id,
    });

    /* ===================================================
         NOT CREATED YET
      =================================================== */

    if (!placement) {
      return res.status(200).json({
        success: true,
        exists: false,
        data: null,
        department,
        message: "Department placement has not been created yet",
      });
    }

    /* ===================================================
         RESPONSE
      =================================================== */

    res.status(200).json({
      success: true,
      exists: true,
      data: placement,
      department,
    });
  } catch (error) {
    console.error("Get Department Placement By Slug Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch department placement",
    });
  }
};

/* =========================================================
   CREATE PLACEMENT

   POST /api/department-placement
========================================================= */

export const createDepartmentPlacement = async (req, res) => {
  try {
    const {
      departmentId,
      placementStatistics,
      recruiters,
      placementHistory,
      topPlacements,
      trainings,
      process,
      testimonials,
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
         CHECK EXISTING
      =================================================== */

    const existing = await DepartmentPlacement.findOne({
      departmentId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Department placement already exists",
      });
    }

    /* ===================================================
         CREATE
      =================================================== */

    const placement = await DepartmentPlacement.create({
      departmentId,

      placementStatistics:
        placementStatistics && typeof placementStatistics === "object"
          ? {
              placementRate: placementStatistics.placementRate || "",

              highestPackage: placementStatistics.highestPackage || "",

              averagePackage: placementStatistics.averagePackage || "",

              offersReceived: placementStatistics.offersReceived || "",
            }
          : {},

      recruiters: Array.isArray(recruiters) ? recruiters : [],

      placementHistory: Array.isArray(placementHistory) ? placementHistory : [],

      topPlacements: Array.isArray(topPlacements) ? topPlacements : [],

      trainings: Array.isArray(trainings) ? trainings : [],

      process: Array.isArray(process) ? process : [],

      testimonials: Array.isArray(testimonials) ? testimonials : [],
    });

    res.status(201).json({
      success: true,
      message: "Department placement created successfully",
      data: placement,
    });
  } catch (error) {
    console.error("Create Department Placement Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create department placement",
    });
  }
};

/* =========================================================
   UPDATE PLACEMENT

   PUT /api/department-placement/:departmentId
========================================================= */

export const updateDepartmentPlacement = async (req, res) => {
  try {
    const {
      placementStatistics,
      recruiters,
      placementHistory,
      topPlacements,
      trainings,
      process,
      testimonials,
    } = req.body;

    /* ===================================================
         FIND EXISTING
      =================================================== */

    const existing = await DepartmentPlacement.findOne({
      departmentId: req.params.departmentId,
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Department placement not found",
      });
    }

    /* ===================================================
         UPDATE
      =================================================== */

    const placement = await DepartmentPlacement.findOneAndUpdate(
      {
        departmentId: req.params.departmentId,
      },
      {
        placementStatistics:
          placementStatistics && typeof placementStatistics === "object"
            ? {
                placementRate: placementStatistics.placementRate || "",

                highestPackage: placementStatistics.highestPackage || "",

                averagePackage: placementStatistics.averagePackage || "",

                offersReceived: placementStatistics.offersReceived || "",
              }
            : {},

        recruiters: Array.isArray(recruiters) ? recruiters : [],

        placementHistory: Array.isArray(placementHistory)
          ? placementHistory
          : [],

        topPlacements: Array.isArray(topPlacements) ? topPlacements : [],

        trainings: Array.isArray(trainings) ? trainings : [],

        process: Array.isArray(process) ? process : [],

        testimonials: Array.isArray(testimonials) ? testimonials : [],
      },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Department placement updated successfully",
      data: placement,
    });
  } catch (error) {
    console.error("Update Department Placement Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update department placement",
    });
  }
};

/* =========================================================
   DELETE PLACEMENT

   DELETE /api/department-placement/:departmentId
========================================================= */

export const deleteDepartmentPlacement = async (req, res) => {
  try {
    const placement = await DepartmentPlacement.findOneAndDelete({
      departmentId: req.params.departmentId,
    });

    if (!placement) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "Department placement not created yet",
      });
    }

    res.status(200).json({
      success: true,
      message: "Department placement deleted successfully",
    });
  } catch (error) {
    console.error("Delete Department Placement Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete department placement",
    });
  }
};
