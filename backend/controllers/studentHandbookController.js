import StudentHandbook from "../models/studentHandbookModel.js";

/* =========================================================
   ADMIN — GET ALL HANDBOOKS
========================================================= */

export const getAllStudentHandbooks = async (req, res) => {
  try {
    const handbooks = await StudentHandbook.find({}).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: handbooks.length,
      data: handbooks,
    });
  } catch (error) {
    console.error("Get all student handbooks error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load student handbooks.",
      error: error.message,
    });
  }
};

/* =========================================================
   PUBLIC — GET PUBLISHED HANDBOOKS
========================================================= */

export const getPublishedStudentHandbooks = async (req, res) => {
  try {
    const handbooks = await StudentHandbook.find({
      status: "published",
    })
      .sort({
        displayOrder: 1,
        createdAt: -1,
      })
      .select("title pdfLink displayOrder status createdAt");

    return res.status(200).json({
      success: true,
      count: handbooks.length,
      data: handbooks,
    });
  } catch (error) {
    console.error("Get published student handbooks error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load student handbooks.",
      error: error.message,
    });
  }
};

/* =========================================================
   ADMIN — GET SINGLE HANDBOOK
========================================================= */

export const getStudentHandbookById = async (req, res) => {
  try {
    const handbook = await StudentHandbook.findById(req.params.id);

    if (!handbook) {
      return res.status(404).json({
        success: false,
        message: "Student handbook not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: handbook,
    });
  } catch (error) {
    console.error("Get student handbook error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load student handbook.",
      error: error.message,
    });
  }
};

/* =========================================================
   ADMIN — CREATE HANDBOOK
========================================================= */

export const createStudentHandbook = async (req, res) => {
  try {
    const { title, pdfLink, displayOrder, status } = req.body;

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Student handbook title is required.",
      });
    }

    if (!pdfLink || !pdfLink.trim()) {
      return res.status(400).json({
        success: false,
        message: "Student handbook PDF link is required.",
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

    const handbook = await StudentHandbook.create({
      title: title.trim(),

      pdfLink: pdfLink.trim(),

      displayOrder: Number(displayOrder) || 0,

      status: status === "draft" ? "draft" : "published",
    });

    return res.status(201).json({
      success: true,
      message: "Student handbook created successfully.",
      data: handbook,
    });
  } catch (error) {
    console.error("Create student handbook error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create student handbook.",
      error: error.message,
    });
  }
};

/* =========================================================
   ADMIN — UPDATE HANDBOOK
========================================================= */

export const updateStudentHandbook = async (req, res) => {
  try {
    const handbook = await StudentHandbook.findById(req.params.id);

    if (!handbook) {
      return res.status(404).json({
        success: false,
        message: "Student handbook not found.",
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
          message: "Student handbook title cannot be empty.",
        });
      }

      handbook.title = title.trim();
    }

    /* =====================================================
       PDF LINK
    ===================================================== */

    if (pdfLink !== undefined) {
      if (!pdfLink.trim()) {
        return res.status(400).json({
          success: false,
          message: "Student handbook PDF link cannot be empty.",
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

      handbook.pdfLink = pdfLink.trim();
    }

    /* =====================================================
       DISPLAY ORDER
    ===================================================== */

    if (displayOrder !== undefined) {
      handbook.displayOrder = Number(displayOrder) || 0;
    }

    /* =====================================================
       STATUS
    ===================================================== */

    if (status !== undefined) {
      handbook.status = status === "draft" ? "draft" : "published";
    }

    await handbook.save();

    return res.status(200).json({
      success: true,
      message: "Student handbook updated successfully.",
      data: handbook,
    });
  } catch (error) {
    console.error("Update student handbook error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update student handbook.",
      error: error.message,
    });
  }
};

/* =========================================================
   ADMIN — DELETE HANDBOOK
========================================================= */

export const deleteStudentHandbook = async (req, res) => {
  try {
    const handbook = await StudentHandbook.findById(req.params.id);

    if (!handbook) {
      return res.status(404).json({
        success: false,
        message: "Student handbook not found.",
      });
    }

    await StudentHandbook.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Student handbook deleted successfully.",
    });
  } catch (error) {
    console.error("Delete student handbook error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete student handbook.",
      error: error.message,
    });
  }
};

/* =========================================================
   ADMIN — TOGGLE PUBLISHED / DRAFT
========================================================= */

export const toggleStudentHandbookStatus = async (req, res) => {
  try {
    const handbook = await StudentHandbook.findById(req.params.id);

    if (!handbook) {
      return res.status(404).json({
        success: false,
        message: "Student handbook not found.",
      });
    }

    handbook.status = handbook.status === "published" ? "draft" : "published";

    await handbook.save();

    return res.status(200).json({
      success: true,

      message:
        handbook.status === "published"
          ? "Student handbook published successfully."
          : "Student handbook moved to draft.",

      data: handbook,
    });
  } catch (error) {
    console.error("Toggle student handbook status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update student handbook status.",
      error: error.message,
    });
  }
};
