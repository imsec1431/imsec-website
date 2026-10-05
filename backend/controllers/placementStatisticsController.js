import PlacementStatistics from "../models/placementStatisticsModel.js";

/* =========================================================
   PUBLIC
========================================================= */

export const getPublicPlacementStatistics = async (req, res) => {
  try {
    const statistics = await PlacementStatistics.find({
      isPublished: true,
    }).sort({
      displayOrder: 1,
    });

    return res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    console.error("Public placement statistics error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load placement statistics.",
    });
  }
};

/* =========================================================
   ADMIN
========================================================= */

export const getAllPlacementStatistics = async (req, res) => {
  try {
    const statistics = await PlacementStatistics.find({}).sort({
      displayOrder: 1,
    });

    return res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to load placement statistics.",
    });
  }
};

/* =========================================================
   CREATE
========================================================= */

export const createPlacementStatistics = async (req, res) => {
  try {
    const {
      academicYear,
      offers,
      studentsPlaced,
      companiesVisited,
      highestCtc,
      highestCtcUnit,
      displayOrder,
      isPublished,
    } = req.body;

    const existing = await PlacementStatistics.findOne({
      academicYear: academicYear.trim(),
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Statistics for this academic year already exist.",
      });
    }

    const statistics = await PlacementStatistics.create({
      academicYear: academicYear.trim(),

      offers: Number(offers) || 0,

      studentsPlaced: Number(studentsPlaced) || 0,

      companiesVisited: Number(companiesVisited) || 0,

      highestCtc: Number(highestCtc) || 0,

      highestCtcUnit: highestCtcUnit || "LPA",

      displayOrder: Number(displayOrder) || 0,

      isPublished:
        isPublished === undefined
          ? true
          : isPublished === true || isPublished === "true",

      createdBy: req.admin?._id || null,

      updatedBy: req.admin?._id || null,
    });

    return res.status(201).json({
      success: true,
      message: "Placement statistics created successfully.",
      data: statistics,
    });
  } catch (error) {
    console.error("Create placement statistics error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create placement statistics.",
    });
  }
};

/* =========================================================
   UPDATE
========================================================= */

export const updatePlacementStatistics = async (req, res) => {
  try {
    const statistics = await PlacementStatistics.findById(req.params.id);

    if (!statistics) {
      return res.status(404).json({
        success: false,
        message: "Placement statistics not found.",
      });
    }

    const {
      academicYear,
      offers,
      studentsPlaced,
      companiesVisited,
      highestCtc,
      highestCtcUnit,
      displayOrder,
      isPublished,
    } = req.body;

    if (academicYear !== undefined)
      statistics.academicYear = academicYear.trim();

    if (offers !== undefined) statistics.offers = Number(offers) || 0;

    if (studentsPlaced !== undefined)
      statistics.studentsPlaced = Number(studentsPlaced) || 0;

    if (companiesVisited !== undefined)
      statistics.companiesVisited = Number(companiesVisited) || 0;

    if (highestCtc !== undefined)
      statistics.highestCtc = Number(highestCtc) || 0;

    if (highestCtcUnit !== undefined)
      statistics.highestCtcUnit = highestCtcUnit;

    if (displayOrder !== undefined)
      statistics.displayOrder = Number(displayOrder) || 0;

    if (isPublished !== undefined)
      statistics.isPublished = isPublished === true || isPublished === "true";

    statistics.updatedBy = req.admin?._id || null;

    await statistics.save();

    return res.status(200).json({
      success: true,
      message: "Placement statistics updated successfully.",
      data: statistics,
    });
  } catch (error) {
    console.error("Update placement statistics error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update placement statistics.",
    });
  }
};

/* =========================================================
   DELETE
========================================================= */

export const deletePlacementStatistics = async (req, res) => {
  try {
    const statistics = await PlacementStatistics.findById(req.params.id);

    if (!statistics) {
      return res.status(404).json({
        success: false,
        message: "Placement statistics not found.",
      });
    }

    await statistics.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Placement statistics deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete placement statistics.",
    });
  }
};
