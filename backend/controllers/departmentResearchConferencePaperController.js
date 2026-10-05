import DepartmentResearchConferencePaper from "../models/DepartmentResearchConferencePaper.js";
import Department from "../models/Department.js";

/* =========================================================
   GET ALL CONFERENCE PAPERS FOR DEPARTMENT
   GET /api/department-research/conference-papers/department/:departmentId
   ========================================================= */

export const getDepartmentResearchConferencePapers = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const papers = await DepartmentResearchConferencePaper.find({
      department: departmentId,
    }).sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: papers,
    });
  } catch (error) {
    console.error("Error fetching department conference papers:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch department conference papers",
      error: error.message,
    });
  }
};

/* =========================================================
   GET SINGLE CONFERENCE PAPER
   GET /api/department-research/conference-papers/:id
   ========================================================= */

export const getDepartmentResearchConferencePaperById = async (req, res) => {
  try {
    const { id } = req.params;

    const paper = await DepartmentResearchConferencePaper.findById(id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Conference paper not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: paper,
    });
  } catch (error) {
    console.error("Error fetching department conference paper:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch conference paper",
      error: error.message,
    });
  }
};

/* =========================================================
   CREATE CONFERENCE PAPER
   POST /api/department-research/conference-papers
   ========================================================= */

export const createDepartmentResearchConferencePaper = async (req, res) => {
  try {
    const {
      department,
      title,
      authors,
      conferenceName,
      conferenceLocation,
      organizer,
      publicationName,
      isbn,
      year,
      date,
      description,
      url,
      documentUrl,
      image,
      publicId,
      order,
      isActive,
    } = req.body;

    /* -----------------------------------------------
       Validation
       ----------------------------------------------- */

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Department is required",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Conference paper title is required",
      });
    }

    /* -----------------------------------------------
       Verify Department
       ----------------------------------------------- */

    const departmentExists = await Department.findById(department);

    if (!departmentExists) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    /* -----------------------------------------------
       Create Paper
       ----------------------------------------------- */

    const paper = await DepartmentResearchConferencePaper.create({
      department,

      title: title.trim(),

      authors: authors?.trim() || "",

      conferenceName: conferenceName?.trim() || "",

      conferenceLocation: conferenceLocation?.trim() || "",

      organizer: organizer?.trim() || "",

      publicationName: publicationName?.trim() || "",

      isbn: isbn?.trim() || "",

      year: year?.trim() || "",

      date: date?.trim() || "",

      description: description?.trim() || "",

      url: url?.trim() || "",

      documentUrl: documentUrl?.trim() || "",

      image: image?.trim() || "",

      publicId: publicId?.trim() || "",

      order: Number(order) || 0,

      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: "Conference paper created successfully",
      data: paper,
    });
  } catch (error) {
    console.error("Error creating department conference paper:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create conference paper",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE CONFERENCE PAPER
   PUT /api/department-research/conference-papers/:id
   ========================================================= */

export const updateDepartmentResearchConferencePaper = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      department,
      title,
      authors,
      conferenceName,
      conferenceLocation,
      organizer,
      publicationName,
      isbn,
      year,
      date,
      description,
      url,
      documentUrl,
      image,
      publicId,
      order,
      isActive,
    } = req.body;

    const paper = await DepartmentResearchConferencePaper.findById(id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Conference paper not found",
      });
    }

    /* -----------------------------------------------
       Department
       ----------------------------------------------- */

    if (department) {
      const departmentExists = await Department.findById(department);

      if (!departmentExists) {
        return res.status(404).json({
          success: false,
          message: "Department not found",
        });
      }

      paper.department = department;
    }

    /* -----------------------------------------------
       Title
       ----------------------------------------------- */

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Conference paper title is required",
        });
      }

      paper.title = title.trim();
    }

    /* -----------------------------------------------
       Optional Fields
       ----------------------------------------------- */

    if (authors !== undefined) {
      paper.authors = authors?.trim() || "";
    }

    if (conferenceName !== undefined) {
      paper.conferenceName = conferenceName?.trim() || "";
    }

    if (conferenceLocation !== undefined) {
      paper.conferenceLocation = conferenceLocation?.trim() || "";
    }

    if (organizer !== undefined) {
      paper.organizer = organizer?.trim() || "";
    }

    if (publicationName !== undefined) {
      paper.publicationName = publicationName?.trim() || "";
    }

    if (isbn !== undefined) {
      paper.isbn = isbn?.trim() || "";
    }

    if (year !== undefined) {
      paper.year = year?.trim() || "";
    }

    if (date !== undefined) {
      paper.date = date?.trim() || "";
    }

    if (description !== undefined) {
      paper.description = description?.trim() || "";
    }

    if (url !== undefined) {
      paper.url = url?.trim() || "";
    }

    if (documentUrl !== undefined) {
      paper.documentUrl = documentUrl?.trim() || "";
    }

    if (image !== undefined) {
      paper.image = image?.trim() || "";
    }

    if (publicId !== undefined) {
      paper.publicId = publicId?.trim() || "";
    }

    if (order !== undefined) {
      paper.order = Number(order) || 0;
    }

    if (isActive !== undefined) {
      paper.isActive = Boolean(isActive);
    }

    await paper.save();

    return res.status(200).json({
      success: true,
      message: "Conference paper updated successfully",
      data: paper,
    });
  } catch (error) {
    console.error("Error updating department conference paper:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update conference paper",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE CONFERENCE PAPER
   DELETE /api/department-research/conference-papers/:id
   ========================================================= */

export const deleteDepartmentResearchConferencePaper = async (req, res) => {
  try {
    const { id } = req.params;

    const paper = await DepartmentResearchConferencePaper.findById(id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Conference paper not found",
      });
    }

    await DepartmentResearchConferencePaper.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Conference paper deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting department conference paper:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete conference paper",
      error: error.message,
    });
  }
};
