import DepartmentResearchAbout from "../models/DepartmentResearchAbout.js";
import Department from "../models/Department.js";

/* =========================================================
   GET RESEARCH ABOUT BY DEPARTMENT
   GET /api/department-research/about/department/:departmentId
   ========================================================= */

export const getDepartmentResearchAbout = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const researchAbout = await DepartmentResearchAbout.findOne({
      department: departmentId,
    });

    return res.status(200).json({
      success: true,
      data: researchAbout,
    });
  } catch (error) {
    console.error("Get Department Research About Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch department research information",
      error: error.message,
    });
  }
};

/* =========================================================
   GET RESEARCH ABOUT BY ID
   GET /api/department-research/about/:id
   ========================================================= */

export const getDepartmentResearchAboutById = async (req, res) => {
  try {
    const { id } = req.params;

    const researchAbout = await DepartmentResearchAbout.findById(id).populate(
      "department",
      "name code slug",
    );

    if (!researchAbout) {
      return res.status(404).json({
        success: false,
        message: "Research information not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: researchAbout,
    });
  } catch (error) {
    console.error("Get Department Research About By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch research information",
      error: error.message,
    });
  }
};

/* =========================================================
   CREATE RESEARCH ABOUT
   POST /api/department-research/about
   ========================================================= */

export const createDepartmentResearchAbout = async (req, res) => {
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

    const existing = await DepartmentResearchAbout.findOne({
      department,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "Research About information already exists for this department",
      });
    }

    const researchAbout = await DepartmentResearchAbout.create({
      department,
      title: title || "Research",
      content: content || "",
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: "Department Research About created successfully",
      data: researchAbout,
    });
  } catch (error) {
    console.error("Create Department Research About Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create research information",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE RESEARCH ABOUT
   PUT /api/department-research/about/:id
   ========================================================= */

export const updateDepartmentResearchAbout = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, content, isActive } = req.body;

    const researchAbout = await DepartmentResearchAbout.findById(id);

    if (!researchAbout) {
      return res.status(404).json({
        success: false,
        message: "Research information not found",
      });
    }

    if (title !== undefined) {
      researchAbout.title = title;
    }

    if (content !== undefined) {
      researchAbout.content = content;
    }

    if (isActive !== undefined) {
      researchAbout.isActive = isActive;
    }

    await researchAbout.save();

    return res.status(200).json({
      success: true,
      message: "Department Research About updated successfully",
      data: researchAbout,
    });
  } catch (error) {
    console.error("Update Department Research About Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update research information",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE RESEARCH ABOUT
   DELETE /api/department-research/about/:id
   ========================================================= */

export const deleteDepartmentResearchAbout = async (req, res) => {
  try {
    const { id } = req.params;

    const researchAbout = await DepartmentResearchAbout.findById(id);

    if (!researchAbout) {
      return res.status(404).json({
        success: false,
        message: "Research information not found",
      });
    }

    await DepartmentResearchAbout.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Department Research About deleted successfully",
    });
  } catch (error) {
    console.error("Delete Department Research About Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete research information",
      error: error.message,
    });
  }
};
