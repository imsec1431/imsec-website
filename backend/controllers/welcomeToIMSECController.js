import WelcomeToIMSEC from "../models/WelcomeToIMSEC.js";

/* =========================================================
   PUBLIC
========================================================= */

export const getPublicWelcomeToIMSEC = async (req, res) => {
  try {
    const data = await WelcomeToIMSEC.find({
      isPublished: true,
    })
      .sort({
        displayOrder: 1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get public Welcome to IMSEC error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Welcome to IMSEC data",
    });
  }
};

/* =========================================================
   ADMIN
========================================================= */

export const getAdminWelcomeToIMSEC = async (req, res) => {
  try {
    const data = await WelcomeToIMSEC.find()
      .sort({
        displayOrder: 1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get admin Welcome to IMSEC error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Welcome to IMSEC data",
    });
  }
};

/* =========================================================
   CREATE
========================================================= */

export const createWelcomeToIMSEC = async (req, res) => {
  try {
    const {
      label,
      title,
      description,
      imageUrl,
      pillars,
      isPublished,
      displayOrder,
    } = req.body;

    if (!label || !title || !description || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Label, title, description and image URL are required",
      });
    }

    let parsedPillars = [];

    if (Array.isArray(pillars)) {
      parsedPillars = pillars;
    } else if (typeof pillars === "string") {
      try {
        parsedPillars = JSON.parse(pillars);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid pillars data",
        });
      }
    }

    const data = await WelcomeToIMSEC.create({
      label: label.trim(),
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      pillars: parsedPillars,
      isPublished: isPublished === true || isPublished === "true",
      displayOrder: Number(displayOrder) || 0,
    });

    return res.status(201).json({
      success: true,
      message: "Welcome to IMSEC created successfully",
      data,
    });
  } catch (error) {
    console.error("Create Welcome to IMSEC error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create Welcome to IMSEC",
    });
  }
};

/* =========================================================
   UPDATE
========================================================= */

export const updateWelcomeToIMSEC = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      label,
      title,
      description,
      imageUrl,
      pillars,
      isPublished,
      displayOrder,
    } = req.body;

    if (!label || !title || !description || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Label, title, description and image URL are required",
      });
    }

    let parsedPillars = [];

    if (Array.isArray(pillars)) {
      parsedPillars = pillars;
    } else if (typeof pillars === "string") {
      try {
        parsedPillars = JSON.parse(pillars);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid pillars data",
        });
      }
    }

    const data = await WelcomeToIMSEC.findByIdAndUpdate(
      id,
      {
        label: label.trim(),
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        pillars: parsedPillars,
        isPublished: isPublished === true || isPublished === "true",
        displayOrder: Number(displayOrder) || 0,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Welcome to IMSEC record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Welcome to IMSEC updated successfully",
      data,
    });
  } catch (error) {
    console.error("Update Welcome to IMSEC error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update Welcome to IMSEC",
    });
  }
};

/* =========================================================
   PUBLISH
========================================================= */

export const publishWelcomeToIMSEC = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await WelcomeToIMSEC.findByIdAndUpdate(
      id,
      {
        isPublished: true,
      },
      {
        new: true,
      },
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Welcome to IMSEC record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Welcome to IMSEC published successfully",
      data,
    });
  } catch (error) {
    console.error("Publish Welcome to IMSEC error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to publish Welcome to IMSEC",
    });
  }
};

/* =========================================================
   UNPUBLISH
========================================================= */

export const unpublishWelcomeToIMSEC = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await WelcomeToIMSEC.findByIdAndUpdate(
      id,
      {
        isPublished: false,
      },
      {
        new: true,
      },
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Welcome to IMSEC record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Welcome to IMSEC unpublished successfully",
      data,
    });
  } catch (error) {
    console.error("Unpublish Welcome to IMSEC error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to unpublish Welcome to IMSEC",
    });
  }
};

/* =========================================================
   DELETE
========================================================= */

export const deleteWelcomeToIMSEC = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await WelcomeToIMSEC.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Welcome to IMSEC record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Welcome to IMSEC deleted successfully",
    });
  } catch (error) {
    console.error("Delete Welcome to IMSEC error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete Welcome to IMSEC",
    });
  }
};
