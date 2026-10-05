import DepartmentResearchJournal from "../models/DepartmentResearchJournal.js";
import Department from "../models/Department.js";

/* =========================================================
   GET ALL JOURNALS FOR A DEPARTMENT
   GET /api/department-research/journals/department/:departmentId
   ========================================================= */

export const getDepartmentResearchJournals = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const journals = await DepartmentResearchJournal.find({
      department: departmentId,
    }).sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: journals,
    });
  } catch (error) {
    console.error("Error fetching department research journals:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch department research journals",
      error: error.message,
    });
  }
};

/* =========================================================
   GET SINGLE JOURNAL
   GET /api/department-research/journals/:id
   ========================================================= */

export const getDepartmentResearchJournalById = async (req, res) => {
  try {
    const { id } = req.params;

    const journal = await DepartmentResearchJournal.findById(id);

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: "Research journal not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: journal,
    });
  } catch (error) {
    console.error("Error fetching department research journal:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch research journal",
      error: error.message,
    });
  }
};

/* =========================================================
   CREATE JOURNAL
   POST /api/department-research/journals
   ========================================================= */

export const createDepartmentResearchJournal = async (req, res) => {
  try {
    const {
      department,
      title,
      description,
      journalName,
      publisher,
      issn,
      volume,
      issue,
      year,
      url,
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

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Journal title is required",
      });
    }

    const departmentExists = await Department.findById(department);

    if (!departmentExists) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const journal = await DepartmentResearchJournal.create({
      department,
      title: title.trim(),
      description: description?.trim() || "",
      journalName: journalName?.trim() || "",
      publisher: publisher?.trim() || "",
      issn: issn?.trim() || "",
      volume: volume?.trim() || "",
      issue: issue?.trim() || "",
      year: year?.trim() || "",
      url: url?.trim() || "",
      image: image?.trim() || "",
      publicId: publicId?.trim() || "",
      order: Number(order) || 0,
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: "Research journal created successfully",
      data: journal,
    });
  } catch (error) {
    console.error("Error creating department research journal:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create research journal",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE JOURNAL
   PUT /api/department-research/journals/:id
   ========================================================= */

export const updateDepartmentResearchJournal = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      department,
      title,
      description,
      journalName,
      publisher,
      issn,
      volume,
      issue,
      year,
      url,
      image,
      publicId,
      order,
      isActive,
    } = req.body;

    const journal = await DepartmentResearchJournal.findById(id);

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: "Research journal not found",
      });
    }

    if (department) {
      const departmentExists = await Department.findById(department);

      if (!departmentExists) {
        return res.status(404).json({
          success: false,
          message: "Department not found",
        });
      }

      journal.department = department;
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Journal title is required",
        });
      }

      journal.title = title.trim();
    }

    if (description !== undefined) {
      journal.description = description?.trim() || "";
    }

    if (journalName !== undefined) {
      journal.journalName = journalName?.trim() || "";
    }

    if (publisher !== undefined) {
      journal.publisher = publisher?.trim() || "";
    }

    if (issn !== undefined) {
      journal.issn = issn?.trim() || "";
    }

    if (volume !== undefined) {
      journal.volume = volume?.trim() || "";
    }

    if (issue !== undefined) {
      journal.issue = issue?.trim() || "";
    }

    if (year !== undefined) {
      journal.year = year?.trim() || "";
    }

    if (url !== undefined) {
      journal.url = url?.trim() || "";
    }

    if (image !== undefined) {
      journal.image = image?.trim() || "";
    }

    if (publicId !== undefined) {
      journal.publicId = publicId?.trim() || "";
    }

    if (order !== undefined) {
      journal.order = Number(order) || 0;
    }

    if (isActive !== undefined) {
      journal.isActive = Boolean(isActive);
    }

    await journal.save();

    return res.status(200).json({
      success: true,
      message: "Research journal updated successfully",
      data: journal,
    });
  } catch (error) {
    console.error("Error updating department research journal:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update research journal",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE JOURNAL
   DELETE /api/department-research/journals/:id
   ========================================================= */

export const deleteDepartmentResearchJournal = async (req, res) => {
  try {
    const { id } = req.params;

    const journal = await DepartmentResearchJournal.findById(id);

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: "Research journal not found",
      });
    }

    await DepartmentResearchJournal.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Research journal deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting department research journal:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete research journal",
      error: error.message,
    });
  }
};
