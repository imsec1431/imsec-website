import LibraryGuideline from "../models/LibraryGuideline.js";

// ======================================
// Add Guideline
// ======================================

export const addGuideline = async (req, res) => {
  try {
    const guideline = await LibraryGuideline.create({
      guideline: req.body.guideline,
      displayOrder: req.body.displayOrder,
      active: req.body.active,
    });

    res.status(201).json({
      success: true,
      message: "Guideline Added Successfully",
      data: guideline,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get All Guidelines
// ======================================

export const getGuidelines = async (req, res) => {
  try {
    const guidelines = await LibraryGuideline.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: guidelines.length,
      data: guidelines,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Single Guideline
// ======================================

export const getGuideline = async (req, res) => {
  try {
    const guideline = await LibraryGuideline.findById(req.params.id);

    if (!guideline) {
      return res.status(404).json({
        success: false,
        message: "Guideline Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: guideline,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Guideline
// ======================================

export const updateGuideline = async (req, res) => {
  try {
    const guideline = await LibraryGuideline.findById(req.params.id);

    if (!guideline) {
      return res.status(404).json({
        success: false,
        message: "Guideline Not Found",
      });
    }

    guideline.guideline = req.body.guideline;
    guideline.displayOrder = req.body.displayOrder;
    guideline.active = req.body.active;

    await guideline.save();

    res.status(200).json({
      success: true,
      message: "Guideline Updated Successfully",
      data: guideline,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Guideline
// ======================================

export const deleteGuideline = async (req, res) => {
  try {
    const guideline = await LibraryGuideline.findById(req.params.id);

    if (!guideline) {
      return res.status(404).json({
        success: false,
        message: "Guideline Not Found",
      });
    }

    await guideline.deleteOne();

    res.status(200).json({
      success: true,
      message: "Guideline Deleted Successfully",
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
