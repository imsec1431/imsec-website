import LearningDevelopmentCentre from "../models/learningDevelopmentCentreModel.js";

/* =========================================================
   ADMIN — GET ALL
========================================================= */

export const getAllLearningDevelopmentCentres = async (req, res) => {
  try {
    const centres = await LearningDevelopmentCentre.find({}).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: centres.length,
      data: centres,
    });
  } catch (error) {
    console.error(
      "Get all learning development centre documents error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load Learning Development Centre documents.",
      error: error.message,
    });
  }
};

/* =========================================================
   PUBLIC — GET PUBLISHED
========================================================= */

export const getPublishedLearningDevelopmentCentres = async (req, res) => {
  try {
    const centres = await LearningDevelopmentCentre.find({
      status: "published",
    })
      .sort({
        displayOrder: 1,
        createdAt: -1,
      })
      .select("title pdfLink displayOrder status createdAt");

    return res.status(200).json({
      success: true,
      count: centres.length,
      data: centres,
    });
  } catch (error) {
    console.error(
      "Get published learning development centre documents error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load Learning Development Centre documents.",
      error: error.message,
    });
  }
};

/* =========================================================
   ADMIN — GET SINGLE
========================================================= */

export const getLearningDevelopmentCentreById = async (req, res) => {
  try {
    const centre = await LearningDevelopmentCentre.findById(req.params.id);

    if (!centre) {
      return res.status(404).json({
        success: false,
        message: "Learning Development Centre document not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: centre,
    });
  } catch (error) {
    console.error("Get learning development centre document error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load Learning Development Centre document.",
      error: error.message,
    });
  }
};

/* =========================================================
   ADMIN — CREATE
========================================================= */

export const createLearningDevelopmentCentre = async (req, res) => {
  try {
    const { title, pdfLink, displayOrder, status } = req.body;

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Learning Development Centre title is required.",
      });
    }

    if (!pdfLink || !pdfLink.trim()) {
      return res.status(400).json({
        success: false,
        message: "PDF link is required.",
      });
    }

    /* =====================================================
       URL VALIDATION
    ===================================================== */

    try {
      new URL(pdfLink.trim());
    } catch {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid PDF URL.",
      });
    }

    /* =====================================================
       CREATE
    ===================================================== */

    const centre = await LearningDevelopmentCentre.create({
      title: title.trim(),

      pdfLink: pdfLink.trim(),

      displayOrder: Number(displayOrder) || 0,

      status: status === "draft" ? "draft" : "published",
    });

    return res.status(201).json({
      success: true,
      message: "Learning Development Centre document created successfully.",
      data: centre,
    });
  } catch (error) {
    console.error("Create learning development centre document error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create Learning Development Centre document.",
      error: error.message,
    });
  }
};

/* =========================================================
   ADMIN — UPDATE
========================================================= */

export const updateLearningDevelopmentCentre = async (req, res) => {
  try {
    const centre = await LearningDevelopmentCentre.findById(req.params.id);

    if (!centre) {
      return res.status(404).json({
        success: false,
        message: "Learning Development Centre document not found.",
      });
    }

    const { title, pdfLink, displayOrder, status } = req.body;

    /* =====================================================
       TITLE
    ===================================================== */

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty.",
        });
      }

      centre.title = title.trim();
    }

    /* =====================================================
       PDF LINK
    ===================================================== */

    if (pdfLink !== undefined) {
      if (!pdfLink.trim()) {
        return res.status(400).json({
          success: false,
          message: "PDF link cannot be empty.",
        });
      }

      try {
        new URL(pdfLink.trim());
      } catch {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid PDF URL.",
        });
      }

      centre.pdfLink = pdfLink.trim();
    }

    /* =====================================================
       DISPLAY ORDER
    ===================================================== */

    if (displayOrder !== undefined) {
      centre.displayOrder = Number(displayOrder) || 0;
    }

    /* =====================================================
       STATUS
    ===================================================== */

    if (status !== undefined) {
      centre.status = status === "draft" ? "draft" : "published";
    }

    await centre.save();

    return res.status(200).json({
      success: true,
      message: "Learning Development Centre document updated successfully.",
      data: centre,
    });
  } catch (error) {
    console.error("Update learning development centre document error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update Learning Development Centre document.",
      error: error.message,
    });
  }
};

/* =========================================================
   ADMIN — DELETE
========================================================= */

export const deleteLearningDevelopmentCentre = async (req, res) => {
  try {
    const centre = await LearningDevelopmentCentre.findById(req.params.id);

    if (!centre) {
      return res.status(404).json({
        success: false,
        message: "Learning Development Centre document not found.",
      });
    }

    await LearningDevelopmentCentre.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Learning Development Centre document deleted successfully.",
    });
  } catch (error) {
    console.error("Delete learning development centre document error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete Learning Development Centre document.",
      error: error.message,
    });
  }
};

/* =========================================================
   ADMIN — TOGGLE STATUS
========================================================= */

export const toggleLearningDevelopmentCentreStatus = async (req, res) => {
  try {
    const centre = await LearningDevelopmentCentre.findById(req.params.id);

    if (!centre) {
      return res.status(404).json({
        success: false,
        message: "Learning Development Centre document not found.",
      });
    }

    centre.status = centre.status === "published" ? "draft" : "published";

    await centre.save();

    return res.status(200).json({
      success: true,

      message:
        centre.status === "published"
          ? "Learning Development Centre document published successfully."
          : "Learning Development Centre document moved to draft.",

      data: centre,
    });
  } catch (error) {
    console.error("Toggle learning development centre status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update Learning Development Centre status.",
      error: error.message,
    });
  }
};
