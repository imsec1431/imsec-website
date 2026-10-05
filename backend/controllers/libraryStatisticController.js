import LibraryStatistic from "../models/LibraryStatistic.js";

// =====================================
// Add Statistic
// =====================================

export const addStatistic = async (req, res) => {
  try {
    const statistic = await LibraryStatistic.create({
      title: req.body.title,
      value: req.body.value,
      icon: req.body.icon,
      displayOrder: req.body.displayOrder,
      active: req.body.active,
    });

    res.status(201).json({
      success: true,
      message: "Library Statistic Added Successfully",
      data: statistic,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Get All Statistics
// =====================================

export const getStatistics = async (req, res) => {
  try {
    const statistics = await LibraryStatistic.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: statistics.length,
      data: statistics,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Get Single Statistic
// =====================================

export const getStatistic = async (req, res) => {
  try {
    const statistic = await LibraryStatistic.findById(req.params.id);

    if (!statistic) {
      return res.status(404).json({
        success: false,
        message: "Statistic not found",
      });
    }

    res.status(200).json({
      success: true,
      data: statistic,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Update Statistic
// =====================================

export const updateStatistic = async (req, res) => {
  try {
    const statistic = await LibraryStatistic.findById(req.params.id);

    if (!statistic) {
      return res.status(404).json({
        success: false,
        message: "Statistic not found",
      });
    }

    statistic.title = req.body.title;
    statistic.value = req.body.value;
    statistic.icon = req.body.icon;
    statistic.displayOrder = req.body.displayOrder;
    statistic.active = req.body.active;

    await statistic.save();

    res.status(200).json({
      success: true,
      message: "Library Statistic Updated Successfully",
      data: statistic,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Delete Statistic
// =====================================

export const deleteStatistic = async (req, res) => {
  try {
    const statistic = await LibraryStatistic.findById(req.params.id);

    if (!statistic) {
      return res.status(404).json({
        success: false,
        message: "Statistic not found",
      });
    }

    await statistic.deleteOne();

    res.status(200).json({
      success: true,
      message: "Library Statistic Deleted Successfully",
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
