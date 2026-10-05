import ResearchAbout from "../models/ResearchAbout.js";

/* =========================================
   GET RESEARCH ABOUT
========================================= */

export const getResearchAbout = async (req, res) => {
  try {
    const about = await ResearchAbout.findOne({
      status: "Active",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("Get Research About Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch research about",
    });
  }
};

/* =========================================
   CREATE
========================================= */

export const createResearchAbout = async (req, res) => {
  try {
    const { vision, mission, status } = req.body;

    if (!vision || !vision.trim()) {
      return res.status(400).json({
        success: false,
        message: "Vision is required",
      });
    }

    if (!mission || !mission.trim()) {
      return res.status(400).json({
        success: false,
        message: "Mission is required",
      });
    }

    const about = await ResearchAbout.create({
      vision,
      mission,
      status: status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "Research Vision & Mission created successfully",
      data: about,
    });
  } catch (error) {
    console.error("Create Research About Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create research about",
    });
  }
};

/* =========================================
   UPDATE
========================================= */

export const updateResearchAbout = async (req, res) => {
  try {
    const { id } = req.params;
    const { vision, mission, status } = req.body;

    if (!vision || !vision.trim()) {
      return res.status(400).json({
        success: false,
        message: "Vision is required",
      });
    }

    if (!mission || !mission.trim()) {
      return res.status(400).json({
        success: false,
        message: "Mission is required",
      });
    }

    const about = await ResearchAbout.findByIdAndUpdate(
      id,
      {
        vision,
        mission,
        status,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "Research About content not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Research Vision & Mission updated successfully",
      data: about,
    });
  } catch (error) {
    console.error("Update Research About Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update research about",
    });
  }
};

/* =========================================
   DELETE
========================================= */

export const deleteResearchAbout = async (req, res) => {
  try {
    const { id } = req.params;

    const about = await ResearchAbout.findByIdAndDelete(id);

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "Research About content not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Research Vision & Mission deleted successfully",
    });
  } catch (error) {
    console.error("Delete Research About Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete research about",
    });
  }
};
