import Department from "../models/Department.js";

/* =========================================================
   GET ALL DEPARTMENTS
   PRIORITY WISE
========================================================= */

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({
      priority: 1,
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    console.error("Get Departments Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
    });
  }
};

/* =========================================================
   GET SINGLE DEPARTMENT
========================================================= */

export const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    console.error("Get Department Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch department",
    });
  }
};

/* =========================================================
   CREATE DEPARTMENT
========================================================= */

export const createDepartment = async (req, res) => {
  try {
    const {
      name,
      code,
      shortName,
      type,
      slug,
      publicPath,
      description,
      priority,
      status,
    } = req.body;

    /* =====================================================
       NAME VALIDATION
    ===================================================== */

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    /* =====================================================
       CODE VALIDATION
    ===================================================== */

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department code is required",
      });
    }

    /* =====================================================
       TYPE VALIDATION
    ===================================================== */

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Department type is required",
      });
    }

    /* =====================================================
       PUBLIC PAGE PATH VALIDATION
    ===================================================== */

    if (!publicPath || !publicPath.trim()) {
      return res.status(400).json({
        success: false,
        message: "Public page path is required",
      });
    }

    /* =====================================================
       SLUG
    ===================================================== */

    const finalSlug =
      slug?.trim() ||
      name
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

    /* =====================================================
       CHECK DUPLICATE CODE
    ===================================================== */

    const existingCode = await Department.findOne({
      code: code.trim().toUpperCase(),
    });

    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: "A department with this code already exists",
      });
    }

    /* =====================================================
       CHECK DUPLICATE SLUG
    ===================================================== */

    const existingDepartment = await Department.findOne({
      slug: finalSlug,
    });

    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        message: "A department with this slug already exists",
      });
    }

    /* =====================================================
       CREATE DEPARTMENT
    ===================================================== */

    const department = await Department.create({
      name: name.trim(),

      code: code.trim().toUpperCase(),

      shortName: shortName?.trim() || "",

      type,

      slug: finalSlug,

      publicPath: publicPath.trim(),

      description: description?.trim() || "",

      priority: Number(priority) || 1,

      status: status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "Department added successfully",
      data: department,
    });
  } catch (error) {
    console.error("Create Department Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add department",
    });
  }
};

/* =========================================================
   UPDATE DEPARTMENT
========================================================= */

export const updateDepartment = async (req, res) => {
  try {
    const {
      name,
      code,
      shortName,
      type,
      slug,
      publicPath,
      description,
      priority,
      status,
    } = req.body;

    /* =====================================================
       NAME VALIDATION
    ===================================================== */

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    /* =====================================================
       CODE VALIDATION
    ===================================================== */

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department code is required",
      });
    }

    /* =====================================================
       TYPE VALIDATION
    ===================================================== */

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Department type is required",
      });
    }

    /* =====================================================
       PUBLIC PAGE PATH VALIDATION
    ===================================================== */

    if (!publicPath || !publicPath.trim()) {
      return res.status(400).json({
        success: false,
        message: "Public page path is required",
      });
    }

    /* =====================================================
       CHECK CODE USED BY ANOTHER DEPARTMENT
    ===================================================== */

    const duplicateCode = await Department.findOne({
      code: code.trim().toUpperCase(),
      _id: {
        $ne: req.params.id,
      },
    });

    if (duplicateCode) {
      return res.status(400).json({
        success: false,
        message: "A department with this code already exists",
      });
    }

    /* =====================================================
       SLUG
    ===================================================== */

    const finalSlug =
      slug?.trim() ||
      name
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

    /* =====================================================
       CHECK SLUG USED BY ANOTHER DEPARTMENT
    ===================================================== */

    const duplicateSlug = await Department.findOne({
      slug: finalSlug,
      _id: {
        $ne: req.params.id,
      },
    });

    if (duplicateSlug) {
      return res.status(400).json({
        success: false,
        message: "A department with this slug already exists",
      });
    }

    /* =====================================================
       UPDATE DEPARTMENT
    ===================================================== */

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),

        code: code.trim().toUpperCase(),

        shortName: shortName?.trim() || "",

        type,

        slug: finalSlug,

        publicPath: publicPath.trim(),

        description: description?.trim() || "",

        priority: Number(priority) || 1,

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

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    console.error("Update Department Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update department",
    });
  }
};

/* =========================================================
   DELETE DEPARTMENT
========================================================= */

export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error("Delete Department Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete department",
    });
  }
};

/* =========================================================
   GET ACTIVE DEPARTMENTS
   PUBLIC WEBSITE
   PRIORITY WISE
========================================================= */

export const getActiveDepartments = async (req, res) => {
  try {
    const departments = await Department.find({
      status: "Active",
    }).sort({
      priority: 1,
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    console.error("Get Active Departments Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch active departments",
    });
  }
};
/* =========================================================
   GET DEPARTMENT BY SLUG
   USED BY DEPARTMENT CMS PAGES
========================================================= */

/* =========================================================
   GET DEPARTMENT BY SLUG
   ALSO SUPPORT DEPARTMENT CODE
========================================================= */

export const getDepartmentBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!slug || !slug.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department slug is required",
      });
    }

    const searchValue = slug.trim();

    /* =====================================================
       FIND BY SLUG
       CASE INSENSITIVE
    ===================================================== */

    let department = await Department.findOne({
      slug: {
        $regex: `^${searchValue}$`,
        $options: "i",
      },
    });

    /* =====================================================
       IF SLUG NOT FOUND
       TRY DEPARTMENT CODE
    ===================================================== */

    if (!department) {
      department = await Department.findOne({
        code: {
          $regex: `^${searchValue}$`,
          $options: "i",
        },
      });
    }

    /* =====================================================
       NOT FOUND
    ===================================================== */

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    /* =====================================================
       RESPONSE
    ===================================================== */

    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    console.error("Get Department By Slug Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch department",
    });
  }
};
