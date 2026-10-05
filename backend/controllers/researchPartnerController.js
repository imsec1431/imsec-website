import ResearchPartner from "../models/ResearchPartner.js";

/* =========================================
   GET ALL PARTNERS
   PRIORITY WISE
========================================= */

export const getResearchPartners = async (req, res) => {
  try {
    const partners = await ResearchPartner.find()
      .sort({ priority: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: partners.length,
      data: partners,
    });
  } catch (error) {
    console.error("Get Research Partners Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch research partners",
    });
  }
};

/* =========================================
   GET SINGLE PARTNER
========================================= */

export const getResearchPartner = async (req, res) => {
  try {
    const partner = await ResearchPartner.findById(
      req.params.id
    );

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Research partner not found",
      });
    }

    res.status(200).json({
      success: true,
      data: partner,
    });
  } catch (error) {
    console.error("Get Research Partner Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch research partner",
    });
  }
};

/* =========================================
   CREATE
========================================= */

export const createResearchPartner = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      website,
      priority,
      status,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Partner name is required",
      });
    }

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Partner type is required",
      });
    }

    const partner = await ResearchPartner.create({
      name,
      type,
      description,
      website,
      priority: Number(priority) || 1,
      status: status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "Research partner added successfully",
      data: partner,
    });
  } catch (error) {
    console.error("Create Research Partner Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add research partner",
    });
  }
};

/* =========================================
   UPDATE
========================================= */

export const updateResearchPartner = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      website,
      priority,
      status,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Partner name is required",
      });
    }

    const partner =
      await ResearchPartner.findByIdAndUpdate(
        req.params.id,
        {
          name,
          type,
          description,
          website,
          priority: Number(priority) || 1,
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Research partner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Research partner updated successfully",
      data: partner,
    });
  } catch (error) {
    console.error("Update Research Partner Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update research partner",
    });
  }
};

/* =========================================
   DELETE
========================================= */

export const deleteResearchPartner = async (req, res) => {
  try {
    const partner =
      await ResearchPartner.findByIdAndDelete(
        req.params.id
      );

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Research partner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Research partner deleted successfully",
    });
  } catch (error) {
    console.error("Delete Research Partner Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete research partner",
    });
  }
};