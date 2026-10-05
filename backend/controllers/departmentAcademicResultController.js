import DepartmentAcademicResult from "../models/DepartmentAcademicResult.js";
import Department from "../models/Department.js";

/* =========================================================
   GET ACADEMIC RESULTS BY DEPARTMENT
   GET /api/department-academic-results/:departmentId
========================================================= */

export const getAcademicResults = async (req, res) => {
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
       FIND ACADEMIC RESULTS
    ===================================================== */

    const academicResults = await DepartmentAcademicResult.findOne({
      departmentId,
    });

    /* =====================================================
       NO RESULTS YET
    ===================================================== */

    if (!academicResults) {
      return res.status(200).json({
        success: true,
        exists: false,
        data: null,
        message: "Academic results not created yet",
      });
    }

    /* =====================================================
       SUCCESS
    ===================================================== */

    return res.status(200).json({
      success: true,
      exists: true,
      data: academicResults,
    });
  } catch (error) {
    console.error("Get Academic Results Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch academic results",
    });
  }
};

/* =========================================================
   GET PUBLIC ACADEMIC RESULTS BY DEPARTMENT SLUG
   GET /api/department-academic-results/slug/:slug
========================================================= */

export const getAcademicResultsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    /* =====================================================
       FIND DEPARTMENT BY SLUG
    ===================================================== */

    const department = await Department.findOne({
      slug: slug.toLowerCase(),
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    /* =====================================================
       FIND ACADEMIC RESULTS
    ===================================================== */

    const academicResults = await DepartmentAcademicResult.findOne({
      departmentId: department._id,
    });

    /* =====================================================
       NO RESULTS
    ===================================================== */

    if (!academicResults) {
      return res.status(200).json({
        success: true,
        exists: false,
        data: null,
        message: "Academic results not created yet",
      });
    }

    /* =====================================================
       CHECK STATUS
    ===================================================== */

    if (academicResults.status !== "Active") {
      return res.status(200).json({
        success: true,
        exists: false,
        data: null,
        message: "Academic results are currently unavailable",
      });
    }

    /* =====================================================
       SORT RESULTS
    ===================================================== */

    const sortedResults = [...(academicResults.results || [])].sort(
      (a, b) => Number(a.displayOrder || 999) - Number(b.displayOrder || 999),
    );

    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.status(200).json({
      success: true,
      exists: true,

      data: {
        _id: academicResults._id,

        departmentId: department._id,

        departmentName: department.name,

        departmentSlug: department.slug,

        status: academicResults.status,

        results: sortedResults,
      },
    });
  } catch (error) {
    console.error("Get Public Academic Results Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch academic results",
    });
  }
};
/* =========================================================
   CREATE ACADEMIC RESULTS
   POST /api/department-academic-results
========================================================= */

export const createAcademicResults = async (req, res) => {
  try {
    const { departmentId, results, status } = req.body;

    /* =====================================================
       DEPARTMENT REQUIRED
    ===================================================== */

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message: "Department is required",
      });
    }

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
       CHECK EXISTING RECORD
    ===================================================== */

    const existing = await DepartmentAcademicResult.findOne({
      departmentId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Academic results already exist for this department",
      });
    }

    /* =====================================================
       VALIDATE RESULTS
    ===================================================== */

    if (!Array.isArray(results)) {
      return res.status(400).json({
        success: false,
        message: "Results must be an array",
      });
    }

    /* =====================================================
       CREATE
    ===================================================== */

    const academicResults = await DepartmentAcademicResult.create({
      departmentId,

      results,

      status: status || "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Academic results created successfully",
      data: academicResults,
    });
  } catch (error) {
    console.error("Create Academic Results Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create academic results",
    });
  }
};

/* =========================================================
   UPDATE ACADEMIC RESULTS
   PUT /api/department-academic-results/:departmentId
========================================================= */

export const updateAcademicResults = async (req, res) => {
  try {
    const { results, status } = req.body;

    /* =====================================================
       VALIDATE RESULTS
    ===================================================== */

    if (!Array.isArray(results)) {
      return res.status(400).json({
        success: false,
        message: "Results must be an array",
      });
    }

    /* =====================================================
       UPDATE
    ===================================================== */

    const academicResults = await DepartmentAcademicResult.findOneAndUpdate(
      {
        departmentId: req.params.departmentId,
      },
      {
        results,

        status: status || "Active",
      },
      {
        new: true,
        runValidators: true,
      },
    );

    /* =====================================================
       NOT FOUND
    ===================================================== */

    if (!academicResults) {
      return res.status(404).json({
        success: false,
        message: "Academic results not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Academic results updated successfully",
      data: academicResults,
    });
  } catch (error) {
    console.error("Update Academic Results Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update academic results",
    });
  }
};

/* =========================================================
   DELETE ACADEMIC RESULTS
   DELETE /api/department-academic-results/:departmentId
========================================================= */

export const deleteAcademicResults = async (req, res) => {
  try {
    const academicResults = await DepartmentAcademicResult.findOneAndDelete({
      departmentId: req.params.departmentId,
    });

    /* =====================================================
       NOTHING TO DELETE
    ===================================================== */

    if (!academicResults) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "Academic results not created yet",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Academic results deleted successfully",
    });
  } catch (error) {
    console.error("Delete Academic Results Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete academic results",
    });
  }
};
