import Convocation from "../models/Convocation.js";

// ==========================================
// PUBLIC - Get Published Convocations
// ==========================================
export const getPublicConvocations = async (req, res) => {
  try {
    const convocations = await Convocation.find({
      isPublished: true,
    }).sort({
      displayOrder: 1,
      year: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: convocations,
    });
  } catch (error) {
    console.error("Get public convocations error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch convocations",
    });
  }
};

// ==========================================
// ADMIN - Get All Convocations
// ==========================================
export const getAdminConvocations = async (req, res) => {
  try {
    const convocations = await Convocation.find().sort({
      displayOrder: 1,
      year: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: convocations,
    });
  } catch (error) {
    console.error("Get admin convocations error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch convocations",
    });
  }
};

// ==========================================
// ADMIN - Create Convocation
// ==========================================
export const createConvocation = async (req, res) => {
  try {
    const {
      title,
      description,
      year,
      pdfLink,
      socialMedia,
      isPublished,
      displayOrder,
    } = req.body;

    // Required fields
    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    if (year === undefined || year === null || year === "") {
      return res.status(400).json({
        success: false,
        message: "Year is required",
      });
    }

    if (!pdfLink?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Photos PDF link is required",
      });
    }

    const parsedYear = Number(year);

    if (
      !Number.isInteger(parsedYear) ||
      parsedYear < 1900 ||
      parsedYear > 2200
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid year",
      });
    }

    const convocation = await Convocation.create({
      title: title.trim(),
      description: description.trim(),
      year: parsedYear,
      pdfLink: pdfLink.trim(),

      socialMedia: {
        facebook: socialMedia?.facebook?.trim() || "",
        instagram: socialMedia?.instagram?.trim() || "",
        youtube: socialMedia?.youtube?.trim() || "",
        linkedin: socialMedia?.linkedin?.trim() || "",
        x: socialMedia?.x?.trim() || "",
      },

      isPublished: isPublished === true || isPublished === "true",

      displayOrder:
        displayOrder === undefined || displayOrder === ""
          ? 0
          : Number(displayOrder),
    });

    res.status(201).json({
      success: true,
      message: "Convocation created successfully",
      data: convocation,
    });
  } catch (error) {
    console.error("Create convocation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create convocation",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN - Update Convocation
// ==========================================
export const updateConvocation = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      year,
      pdfLink,
      socialMedia,
      isPublished,
      displayOrder,
    } = req.body;

    const convocation = await Convocation.findById(id);

    if (!convocation) {
      return res.status(404).json({
        success: false,
        message: "Convocation not found",
      });
    }

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    if (year === undefined || year === null || year === "") {
      return res.status(400).json({
        success: false,
        message: "Year is required",
      });
    }

    if (!pdfLink?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Photos PDF link is required",
      });
    }

    const parsedYear = Number(year);

    if (
      !Number.isInteger(parsedYear) ||
      parsedYear < 1900 ||
      parsedYear > 2200
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid year",
      });
    }

    convocation.title = title.trim();
    convocation.description = description.trim();
    convocation.year = parsedYear;
    convocation.pdfLink = pdfLink.trim();

    convocation.socialMedia = {
      facebook: socialMedia?.facebook?.trim() || "",
      instagram: socialMedia?.instagram?.trim() || "",
      youtube: socialMedia?.youtube?.trim() || "",
      linkedin: socialMedia?.linkedin?.trim() || "",
      x: socialMedia?.x?.trim() || "",
    };

    convocation.isPublished = isPublished === true || isPublished === "true";

    convocation.displayOrder =
      displayOrder === undefined || displayOrder === ""
        ? 0
        : Number(displayOrder);

    await convocation.save();

    res.status(200).json({
      success: true,
      message: "Convocation updated successfully",
      data: convocation,
    });
  } catch (error) {
    console.error("Update convocation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update convocation",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN - Publish Convocation
// ==========================================
export const publishConvocation = async (req, res) => {
  try {
    const { id } = req.params;

    const convocation = await Convocation.findByIdAndUpdate(
      id,
      { isPublished: true },
      { new: true },
    );

    if (!convocation) {
      return res.status(404).json({
        success: false,
        message: "Convocation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Convocation published successfully",
      data: convocation,
    });
  } catch (error) {
    console.error("Publish convocation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to publish convocation",
    });
  }
};

// ==========================================
// ADMIN - Unpublish Convocation
// ==========================================
export const unpublishConvocation = async (req, res) => {
  try {
    const { id } = req.params;

    const convocation = await Convocation.findByIdAndUpdate(
      id,
      { isPublished: false },
      { new: true },
    );

    if (!convocation) {
      return res.status(404).json({
        success: false,
        message: "Convocation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Convocation unpublished successfully",
      data: convocation,
    });
  } catch (error) {
    console.error("Unpublish convocation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to unpublish convocation",
    });
  }
};

// ==========================================
// ADMIN - Delete Convocation
// ==========================================
export const deleteConvocation = async (req, res) => {
  try {
    const { id } = req.params;

    const convocation = await Convocation.findByIdAndDelete(id);

    if (!convocation) {
      return res.status(404).json({
        success: false,
        message: "Convocation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Convocation deleted successfully",
    });
  } catch (error) {
    console.error("Delete convocation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete convocation",
    });
  }
};
