import PlacementStat from "../models/PlacementStat.js";

// Create
export const createPlacementStat = async (req, res) => {
  try {
    const placementStat = await PlacementStat.create(req.body);

    res.status(201).json({
      success: true,
      data: placementStat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All
export const getPlacementStats = async (req, res) => {
  try {
    const placementStats = await PlacementStat.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: placementStats.length,
      data: placementStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single
export const getPlacementStatById = async (req, res) => {
  try {
    const placementStat = await PlacementStat.findById(req.params.id);

    if (!placementStat) {
      return res.status(404).json({
        success: false,
        message: "Placement Statistic not found",
      });
    }

    res.status(200).json({
      success: true,
      data: placementStat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update
export const updatePlacementStat = async (req, res) => {
  try {
    const placementStat = await PlacementStat.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!placementStat) {
      return res.status(404).json({
        success: false,
        message: "Placement Statistic not found",
      });
    }

    res.status(200).json({
      success: true,
      data: placementStat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete
export const deletePlacementStat = async (req, res) => {
  try {
    const placementStat = await PlacementStat.findByIdAndDelete(req.params.id);

    if (!placementStat) {
      return res.status(404).json({
        success: false,
        message: "Placement Statistic not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Placement Statistic deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
