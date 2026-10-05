import DepartmentResearchFDP from "../models/DepartmentResearchFDP.js";
import Department from "../models/Department.js";

/* =========================================================
   GET ALL FDPs BY DEPARTMENT
   ========================================================= */

export const getDepartmentResearchFDPs = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const fdps = await DepartmentResearchFDP.find({
      department: departmentId,
    }).sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: fdps,
    });
  } catch (error) {
    console.error("Get department research FDPs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch department research FDPs",
      error: error.message,
    });
  }
};

/* =========================================================
   GET SINGLE FDP
   ========================================================= */

export const getDepartmentResearchFDPById = async (req, res) => {
  try {
    const { id } = req.params;

    const fdp = await DepartmentResearchFDP.findById(id).populate(
      "department",
      "name slug",
    );

    if (!fdp) {
      return res.status(404).json({
        success: false,
        message: "FDP not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: fdp,
    });
  } catch (error) {
    console.error("Get department research FDP error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch department research FDP",
      error: error.message,
    });
  }
};

/* =========================================================
   CREATE FDP
   ========================================================= */

export const createDepartmentResearchFDP = async (req, res) => {
  try {
    const {
      department,
      title,
      coordinator,
      organizer,
      venue,
      startDate,
      endDate,
      duration,
      mode,
      participants,
      description,
      url,
      documentUrl,
      image,
      publicId,
      year,
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
        message: "FDP title is required",
      });
    }

    const departmentExists = await Department.findById(department);

    if (!departmentExists) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const fdp = await DepartmentResearchFDP.create({
      department,
      title,
      coordinator,
      organizer,
      venue,
      startDate,
      endDate,
      duration,
      mode,
      participants,
      description,
      url,
      documentUrl,
      image,
      publicId,
      year,
      order,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Department research FDP created successfully",
      data: fdp,
    });
  } catch (error) {
    console.error("Create department research FDP error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create department research FDP",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE FDP
   ========================================================= */

export const updateDepartmentResearchFDP = async (req, res) => {
  try {
    const { id } = req.params;

    const existingFDP = await DepartmentResearchFDP.findById(id);

    if (!existingFDP) {
      return res.status(404).json({
        success: false,
        message: "FDP not found",
      });
    }

    const {
      department,
      title,
      coordinator,
      organizer,
      venue,
      startDate,
      endDate,
      duration,
      mode,
      participants,
      description,
      url,
      documentUrl,
      image,
      publicId,
      year,
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
        message: "FDP title is required",
      });
    }

    const departmentExists = await Department.findById(department);

    if (!departmentExists) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    existingFDP.department = department;
    existingFDP.title = title;
    existingFDP.coordinator = coordinator;
    existingFDP.organizer = organizer;
    existingFDP.venue = venue;
    existingFDP.startDate = startDate;
    existingFDP.endDate = endDate;
    existingFDP.duration = duration;
    existingFDP.mode = mode;
    existingFDP.participants = participants;
    existingFDP.description = description;
    existingFDP.url = url;
    existingFDP.documentUrl = documentUrl;
    existingFDP.image = image;
    existingFDP.publicId = publicId;
    existingFDP.year = year;
    existingFDP.order = order;
    existingFDP.isActive = isActive;

    const updatedFDP = await existingFDP.save();

    return res.status(200).json({
      success: true,
      message: "Department research FDP updated successfully",
      data: updatedFDP,
    });
  } catch (error) {
    console.error("Update department research FDP error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update department research FDP",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE FDP
   ========================================================= */

export const deleteDepartmentResearchFDP = async (req, res) => {
  try {
    const { id } = req.params;

    const fdp = await DepartmentResearchFDP.findById(id);

    if (!fdp) {
      return res.status(404).json({
        success: false,
        message: "FDP not found",
      });
    }

    await DepartmentResearchFDP.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Department research FDP deleted successfully",
    });
  } catch (error) {
    console.error("Delete department research FDP error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete department research FDP",
      error: error.message,
    });
  }
};
