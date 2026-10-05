import DepartmentResearchPolicy from "../models/DepartmentResearchPolicy.js";
import Department from "../models/Department.js";

/* =========================================================
   GET RESEARCH POLICY BY DEPARTMENT
   GET /api/department-research/policy/department/:departmentId
   ========================================================= */

export const getDepartmentResearchPolicy = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const researchPolicy = await DepartmentResearchPolicy.findOne({
      department: departmentId,
    });

    return res.status(200).json({
      success: true,
      data: researchPolicy,
    });
  } catch (error) {
    console.error("Get Department Research Policy Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch department research policy",
      error: error.message,
    });
  }
};

/* =========================================================
   GET RESEARCH POLICY BY ID
   GET /api/department-research/policy/:id
   ========================================================= */

export const getDepartmentResearchPolicyById = async (req, res) => {
  try {
    const { id } = req.params;

    const researchPolicy = await DepartmentResearchPolicy.findById(id).populate(
      "department",
      "name code slug",
    );

    if (!researchPolicy) {
      return res.status(404).json({
        success: false,
        message: "Research policy not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: researchPolicy,
    });
  } catch (error) {
    console.error("Get Department Research Policy By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch research policy",
      error: error.message,
    });
  }
};

/* =========================================================
   CREATE RESEARCH POLICY
   POST /api/department-research/policy
   ========================================================= */

export const createDepartmentResearchPolicy = async (req, res) => {
  try {
    const { department, title, content, isActive } = req.body;

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Department is required",
      });
    }

    const departmentExists = await Department.findById(department);

    if (!departmentExists) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const existing = await DepartmentResearchPolicy.findOne({
      department,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Research Policy already exists for this department",
      });
    }

    const researchPolicy = await DepartmentResearchPolicy.create({
      department,
      title: title || "Research Policy",
      content: content || "",
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: "Department Research Policy created successfully",
      data: researchPolicy,
    });
  } catch (error) {
    console.error("Create Department Research Policy Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create research policy",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE RESEARCH POLICY
   PUT /api/department-research/policy/:id
   ========================================================= */

export const updateDepartmentResearchPolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, content, isActive } = req.body;

    const researchPolicy = await DepartmentResearchPolicy.findById(id);

    if (!researchPolicy) {
      return res.status(404).json({
        success: false,
        message: "Research policy not found",
      });
    }

    if (title !== undefined) {
      researchPolicy.title = title;
    }

    if (content !== undefined) {
      researchPolicy.content = content;
    }

    if (isActive !== undefined) {
      researchPolicy.isActive = isActive;
    }

    await researchPolicy.save();

    return res.status(200).json({
      success: true,
      message: "Department Research Policy updated successfully",
      data: researchPolicy,
    });
  } catch (error) {
    console.error("Update Department Research Policy Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update research policy",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE RESEARCH POLICY
   DELETE /api/department-research/policy/:id
   ========================================================= */

export const deleteDepartmentResearchPolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const researchPolicy = await DepartmentResearchPolicy.findById(id);

    if (!researchPolicy) {
      return res.status(404).json({
        success: false,
        message: "Research policy not found",
      });
    }

    await DepartmentResearchPolicy.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Department Research Policy deleted successfully",
    });
  } catch (error) {
    console.error("Delete Department Research Policy Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete research policy",
      error: error.message,
    });
  }
};
