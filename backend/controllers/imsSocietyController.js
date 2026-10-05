import IMSSociety from "../models/IMSSociety.js";

/*=========================================
GET IMS SOCIETY
PUBLIC
=========================================*/

export const getIMSSociety = async (req, res) => {
  try {
    const society = await IMSSociety.findOne({
      isPublished: true,
    }).sort({ createdAt: -1 });

    if (!society) {
      return res.status(404).json({
        success: false,
        message: "IMS Society content not found",
      });
    }

    res.status(200).json({
      success: true,
      data: society,
    });
  } catch (error) {
    console.error("Get IMS Society Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch IMS Society content",
      error: error.message,
    });
  }
};

/*=========================================
GET IMS SOCIETY FOR ADMIN
=========================================*/

export const getIMSSocietyAdmin = async (req, res) => {
  try {
    const society = await IMSSociety.findOne().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: society,
    });
  } catch (error) {
    console.error("Get IMS Society Admin Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch IMS Society content",
      error: error.message,
    });
  }
};

/*=========================================
CREATE IMS SOCIETY
ADMIN
=========================================*/

export const createIMSSociety = async (req, res) => {
  try {
    const existing = await IMSSociety.findOne();

    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          "IMS Society content already exists. Please update it instead.",
      });
    }

    const society = await IMSSociety.create(req.body);

    res.status(201).json({
      success: true,
      message: "IMS Society content created successfully",
      data: society,
    });
  } catch (error) {
    console.error("Create IMS Society Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create IMS Society content",
      error: error.message,
    });
  }
};

/*=========================================
UPDATE IMS SOCIETY
ADMIN
=========================================*/

export const updateIMSSociety = async (req, res) => {
  try {
    const society = await IMSSociety.findOne();

    if (!society) {
      const newSociety = await IMSSociety.create(req.body);

      return res.status(201).json({
        success: true,
        message: "IMS Society content created successfully",
        data: newSociety,
      });
    }

    const updatedSociety = await IMSSociety.findByIdAndUpdate(
      society._id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "IMS Society content updated successfully",
      data: updatedSociety,
    });
  } catch (error) {
    console.error("Update IMS Society Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update IMS Society content",
      error: error.message,
    });
  }
};

/*=========================================
DELETE IMS SOCIETY
ADMIN
=========================================*/

export const deleteIMSSociety = async (req, res) => {
  try {
    await IMSSociety.deleteMany({});

    res.status(200).json({
      success: true,
      message: "IMS Society content deleted successfully",
    });
  } catch (error) {
    console.error("Delete IMS Society Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete IMS Society content",
      error: error.message,
    });
  }
};
