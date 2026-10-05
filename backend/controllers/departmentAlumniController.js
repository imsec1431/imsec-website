import DepartmentAlumni from "../models/DepartmentAlumni.js";
import Department from "../models/Department.js";

/* =========================================================
   GET ALL ALUMNI OF A DEPARTMENT
   GET /api/department-alumni/department/:departmentId
========================================================= */
export const getDepartmentAlumni = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const alumni = await DepartmentAlumni.find({
      department: departmentId,
    }).sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: alumni.length,
      data: alumni,
    });
  } catch (error) {
    console.error("Get department alumni error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch department alumni",
      error: error.message,
    });
  }
};

/* =========================================================
   GET SINGLE ALUMNI
   GET /api/department-alumni/:id
========================================================= */
export const getDepartmentAlumniById = async (req, res) => {
  try {
    const { id } = req.params;

    const alumni = await DepartmentAlumni.findById(id).populate(
      "department",
      "name slug",
    );

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni record not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: alumni,
    });
  } catch (error) {
    console.error("Get single department alumni error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch alumni record",
      error: error.message,
    });
  }
};

/* =========================================================
   CREATE ALUMNI
   POST /api/department-alumni
========================================================= */
export const createDepartmentAlumni = async (req, res) => {
  try {
    const {
      department,
      name,
      course,
      company,
      image,
      publicId,
      order,
      isActive,
    } = req.body;

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Department is required",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Alumni name is required",
      });
    }

    const departmentExists = await Department.findById(department);

    if (!departmentExists) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const alumni = await DepartmentAlumni.create({
      department,
      name: name.trim(),
      course: course?.trim() || "",
      company: company?.trim() || "",
      image: image || "",
      publicId: publicId || "",
      order: Number(order) || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: "Department alumni created successfully",
      data: alumni,
    });
  } catch (error) {
    console.error("Create department alumni error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create department alumni",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE ALUMNI
   PUT /api/department-alumni/:id
========================================================= */
export const updateDepartmentAlumni = async (req, res) => {
  try {
    const { id } = req.params;

    const alumni = await DepartmentAlumni.findById(id);

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni record not found",
      });
    }

    const {
      department,
      name,
      course,
      company,
      image,
      publicId,
      order,
      isActive,
    } = req.body;

    // If department is being changed, verify it exists
    if (department && department !== alumni.department.toString()) {
      const departmentExists = await Department.findById(department);

      if (!departmentExists) {
        return res.status(404).json({
          success: false,
          message: "New department not found",
        });
      }

      alumni.department = department;
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Alumni name is required",
        });
      }

      alumni.name = name.trim();
    }

    if (course !== undefined) {
      alumni.course = course.trim();
    }

    if (company !== undefined) {
      alumni.company = company.trim();
    }

    if (image !== undefined) {
      alumni.image = image;
    }

    if (publicId !== undefined) {
      alumni.publicId = publicId;
    }

    if (order !== undefined) {
      alumni.order = Number(order) || 0;
    }

    if (isActive !== undefined) {
      alumni.isActive = isActive;
    }

    await alumni.save();

    return res.status(200).json({
      success: true,
      message: "Department alumni updated successfully",
      data: alumni,
    });
  } catch (error) {
    console.error("Update department alumni error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update department alumni",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE ALUMNI
   DELETE /api/department-alumni/:id
========================================================= */
export const deleteDepartmentAlumni = async (req, res) => {
  try {
    const { id } = req.params;

    const alumni = await DepartmentAlumni.findById(id);

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni record not found",
      });
    }

    await DepartmentAlumni.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Department alumni deleted successfully",
    });
  } catch (error) {
    console.error("Delete department alumni error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete department alumni",
      error: error.message,
    });
  }
};
