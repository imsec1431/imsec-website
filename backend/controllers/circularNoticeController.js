import CircularNotice from "../models/CircularNotice.js";

// ======================================
// Add Circular / Notice
// ======================================

export const addCircularNotice = async (req, res) => {
  try {
    const notice = await CircularNotice.create(req.body);

    res.status(201).json({
      success: true,
      message: "Circular / Notice Added Successfully",
      data: notice,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get All Circulars
// ======================================

export const getCircularNotices = async (req, res) => {
  try {
    const notices = await CircularNotice.find().sort({
      important: -1,
      displayOrder: 1,
      publishDate: -1,
    });

    res.status(200).json({
      success: true,
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Single Circular
// ======================================

export const getCircularNotice = async (req, res) => {
  try {
    const notice = await CircularNotice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Circular / Notice not found",
      });
    }

    res.status(200).json({
      success: true,
      data: notice,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Circular
// ======================================

export const updateCircularNotice = async (req, res) => {
  try {
    const notice = await CircularNotice.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Circular / Notice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Circular / Notice Updated Successfully",
      data: notice,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Circular
// ======================================

export const deleteCircularNotice = async (req, res) => {
  try {
    const notice = await CircularNotice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Circular / Notice not found",
      });
    }

    await notice.deleteOne();

    res.status(200).json({
      success: true,
      message: "Circular / Notice Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
