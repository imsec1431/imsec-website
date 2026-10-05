import IMSGroup from "../models/IMSGroup.js";

/*=========================================
GET PUBLIC IMS GROUP
=========================================*/

export const getIMSGroup = async (req, res) => {
  try {
    const group = await IMSGroup.findOne({
      isPublished: true,
    }).sort({
      createdAt: -1,
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "IMS Group content not found",
      });
    }

    res.status(200).json({
      success: true,
      data: group,
    });
  } catch (error) {
    console.error("Get IMS Group Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch IMS Group",
      error: error.message,
    });
  }
};

/*=========================================
GET ADMIN IMS GROUP
=========================================*/

export const getIMSGroupAdmin = async (req, res) => {
  try {
    const group = await IMSGroup.findOne().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: group,
    });
  } catch (error) {
    console.error("Get IMS Group Admin Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch IMS Group",
      error: error.message,
    });
  }
};

/*=========================================
CREATE IMS GROUP
=========================================*/

export const createIMSGroup = async (req, res) => {
  try {
    const existing = await IMSGroup.findOne();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "IMS Group content already exists. Please update it.",
      });
    }

    const group = await IMSGroup.create(req.body);

    res.status(201).json({
      success: true,
      message: "IMS Group content created successfully",
      data: group,
    });
  } catch (error) {
    console.error("Create IMS Group Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create IMS Group",
      error: error.message,
    });
  }
};

/*=========================================
UPDATE IMS GROUP
=========================================*/

export const updateIMSGroup = async (req, res) => {
  try {
    const existing = await IMSGroup.findOne();

    if (!existing) {
      const group = await IMSGroup.create(req.body);

      return res.status(201).json({
        success: true,
        message: "IMS Group content created successfully",
        data: group,
      });
    }

    const group = await IMSGroup.findByIdAndUpdate(existing._id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "IMS Group content updated successfully",
      data: group,
    });
  } catch (error) {
    console.error("Update IMS Group Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update IMS Group",
      error: error.message,
    });
  }
};

/*=========================================
DELETE IMS GROUP
=========================================*/

export const deleteIMSGroup = async (req, res) => {
  try {
    await IMSGroup.deleteMany({});

    res.status(200).json({
      success: true,
      message: "IMS Group content deleted successfully",
    });
  } catch (error) {
    console.error("Delete IMS Group Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete IMS Group",
      error: error.message,
    });
  }
};
